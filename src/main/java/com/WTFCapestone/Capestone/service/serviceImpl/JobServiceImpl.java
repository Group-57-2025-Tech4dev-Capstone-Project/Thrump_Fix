package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
import com.WTFCapestone.Capestone.dto.response.CreateJobResponse;
import com.WTFCapestone.Capestone.dto.response.JobHistoryResponse;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.exception.AuthorizationException;
import com.WTFCapestone.Capestone.exception.BadRequestException;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.*;
import com.WTFCapestone.Capestone.security.SecurityUtils;
import com.WTFCapestone.Capestone.service.JobMatchingService;
import com.WTFCapestone.Capestone.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

//please make sure Async or sync is handled properly as well as data roll back
@Service
@Transactional
public class JobServiceImpl implements JobService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private LocalGovernanceAreaRepository lgaRepository;

    @Autowired
    private SubRegionRepository subRegionRepository;

    @Autowired
    private JobMatchingService jobMatchingService;

    @Autowired
    private PlumberProfileRepository plumberProfileRepository;

    // ===============================
    // CREATE JOB
    // ===============================
    @Override
    public CreateJobResponse newJob(CreateJobRequest request) {

        // ✅ CHANGED: get logged-in user instead of trusting request
        Long customerId = SecurityUtils.getCurrentUserId();

        // ✅ validate user
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.CUSTOMER) {
            throw new AuthorizationException("Only customers can create jobs");
        }

        // ✅ load location entities
        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        LocalGovernanceArea lga = lgaRepository.findById(request.getLocalGovernanceId())
                .orElseThrow(() -> new ResourceNotFoundException("LGA not found"));

        SubRegion subRegion = subRegionRepository.findById(request.getSubregionId())
                .orElseThrow(() -> new ResourceNotFoundException("SubRegion not found"));

        // ✅ create job
        Job job = Job.builder()
                .customer(user)
                .state(state)
                .localGovernanceArea(lga)
                .subRegion(subRegion)
                .address(request.getAddress())
                .issueDetails(request.getIssueDetails())
                .status(JobStatus.LOGGED)
                .expiresAt(LocalDateTime.now().plusSeconds(5)) // MVP timer
                .build();

        jobRepository.saveAndFlush(job);   // commit immediately

        // ✅ async AI matching
        jobMatchingService.matchJobAsync(job.getId());

        return mapToResponse(job);
    }

    // ===============================
    // ACCEPT JOB
    // ===============================
    @Transactional
    public void acceptJob(Long jobId, Long plumberId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() == JobStatus.ACCEPTED) {
            throw new BadRequestException("Job already accepted");
        }

        if (job.getStatus() == JobStatus.CANCELLED ||
                job.getStatus() == JobStatus.COMPLETED) {
            throw new BadRequestException("Job not available");
        }

        // ✅ CHANGED: ensure logged-in plumber is the one accepting
        Long loggedInUserId = SecurityUtils.getCurrentUserId();

        PlumberProfile plumber = plumberProfileRepository.findById(plumberId)
                .orElseThrow(() -> new ResourceNotFoundException("Plumber not found"));

        if (!plumber.getUser().getId().equals(loggedInUserId)) {
            throw new AuthorizationException("You can only accept jobs as yourself");
        }

        job.setPlumber(plumber);
        job.setStatus(JobStatus.ACCEPTED);
        job.setAcceptedAt(LocalDateTime.now());

        job.getPlumber(); // customer needs plumber details
    }

    // ===============================
    // CANCEL JOB
    // ===============================
    @Override
    public CreateJobResponse terminateJobRequest(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // ✅ CHANGED: only owner can cancel
        Long loggedInUserId = SecurityUtils.getCurrentUserId();
        if (!job.getCustomer().getId().equals(loggedInUserId)) {
            throw new AuthorizationException("You can only cancel your own job");
        }

        if (job.getStatus() == JobStatus.ACCEPTED ||
                job.getStatus() == JobStatus.COMPLETED) {
            throw new BadRequestException("Job can no longer be cancelled");
        }

        job.setStatus(JobStatus.CANCELLED);
        job.setCancelledAt(LocalDateTime.now());

        return mapToResponse(job);
    }

    // ===============================
    // JOB HISTORY (MVP VERSION)
    // ===============================
    public List<JobHistoryResponse> jobHistoryRecord(Long customerId) {

        // ✅ CHANGED: ignore parameter and use logged-in user
        Long loggedInUserId = SecurityUtils.getCurrentUserId();

        User customer = userRepository.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (customer.getRole() != Role.CUSTOMER) {
            throw new AuthorizationException("Only customers have job history");
        }

        List<Job> jobs = jobRepository.findByCustomerId(loggedInUserId);

        return jobs.stream()
                .map(job -> new JobHistoryResponse(
                        job.getId(),
                        job.getSubRegion().getId(),
                        job.getStatus(),
                        resolveFinalTime(job)
                ))
                .toList();
    }

    // ===============================
    // HELPERS
    // ===============================

    private CreateJobResponse mapToResponse(Job job) {
        return new CreateJobResponse(
                job.getId(),
                job.getCustomer().getId(),
                job.getCustomer().getFullName(),
                job.getCustomer().getPhoneNumber(),
                job.getIssueDetails(),
                job.getState().getId(),
                job.getLocalGovernanceArea().getId(),
                job.getSubRegion().getId(),
                job.getAddress(),
                job.getStatus(),
                job.getCreatedAt()
        );
    }

    private LocalDateTime resolveFinalTime(Job job) {

        if (job.getCompletedAt() != null) return job.getCompletedAt();
        if (job.getCancelledAt() != null) return job.getCancelledAt();
        if (job.getAcceptedAt() != null) return job.getAcceptedAt();
        if (job.getExpiresAt() != null) return job.getExpiresAt();

        return job.getCreatedAt();
    }
}
