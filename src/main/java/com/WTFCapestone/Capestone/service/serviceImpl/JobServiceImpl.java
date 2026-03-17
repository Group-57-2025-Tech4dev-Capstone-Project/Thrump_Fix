package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
import com.WTFCapestone.Capestone.dto.response.*;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.exception.*;
import com.WTFCapestone.Capestone.repository.*;
import com.WTFCapestone.Capestone.security.SecurityUtils;
import com.WTFCapestone.Capestone.service.JobMatchingService;
import com.WTFCapestone.Capestone.service.JobService;
import com.WTFCapestone.Capestone.service.SubscriptionService; // ⭐ ADDED
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final StateRepository stateRepository;
    private final LocalGovernanceAreaRepository lgaRepository;
    private final SubRegionRepository subRegionRepository;
    private final JobMatchingService jobMatchingService;
    private final PlumberProfileRepository plumberProfileRepository;
    private final SubscriptionService subscriptionService; // ⭐ ADDED

    @Override
    public CreateJobResponse newJob(CreateJobRequest request) {

        Long customerId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.CUSTOMER)
            throw new AuthorizationException("Only customers can create jobs");

        if (user.getOnlineStatus() != OnlineStatus.ONLINE)
            throw new AuthorizationException("You must be online");

        // ⭐⭐⭐⭐⭐ SUBSCRIPTION VALIDATION BEFORE JOB CREATION ⭐⭐⭐⭐⭐
        subscriptionService.validateCustomerCanPostJob(user); // ⭐ ADDED

        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new ResourceNotFoundException("State not found"));

        LocalGovernanceArea lga = lgaRepository.findById(request.getLocalGovernanceId())
                .orElseThrow(() -> new ResourceNotFoundException("LGA not found"));

        SubRegion subRegion = subRegionRepository.findById(request.getSubregionId())
                .orElseThrow(() -> new ResourceNotFoundException("SubRegion not found"));

        Job job = Job.builder()
                .customer(user)
                .state(state)
                .localGovernanceArea(lga)
                .subRegion(subRegion)
                .address(request.getAddress())
                .issueDetails(request.getIssueDetails())
                .status(JobStatus.LOGGED)
                .expiresAt(LocalDateTime.now().plusSeconds(70))
                .build();

        job = jobRepository.saveAndFlush(job);

        // ⭐⭐⭐⭐⭐ RECORD TRIAL USAGE AFTER SUCCESS ⭐⭐⭐⭐⭐
        subscriptionService.recordCustomerUsage(user); // ⭐ ADDED

        jobMatchingService.matchJobAsync(job.getId());

        return mapToResponse(job);
    }

    @Override
    public List<AvailableJobResponse> availableJobs() {

        Long userId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.PLUMBER)
            throw new AuthorizationException("Only plumbers");

        PlumberProfile plumber = plumberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile missing"));

        if (user.getOnlineStatus() != OnlineStatus.ONLINE ||
                plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE)
            throw new AuthorizationException("Must be online & available");

        List<Job> jobs = jobRepository.findAvailableMatchedJobs(
                user.getSubRegion().getId(),
                LocalDateTime.now()
        );

        return jobs.stream()
                .map(j -> new AvailableJobResponse(
                        j.getId(),
                        j.getCustomer().getFullName(),
                        null,
                        j.getSubRegion().getId(),
                        j.getAddress(),
                        j.getIssueDetails(),
                        j.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public AcceptedPlumberResponse acceptJob(Long jobId) {

        Job job = jobRepository.findByIdForUpdate(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Job has expired");
        }

        if (job.getStatus() == JobStatus.ACCEPTED)
            throw new BadRequestException("Job already accepted");

        if (job.getStatus() == JobStatus.CANCELLED || job.getStatus() == JobStatus.COMPLETED)
            throw new BadRequestException("Job not available");

        Long loggedInUserId = SecurityUtils.getCurrentUserId();

        PlumberProfile plumber = plumberProfileRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));

        User plumberUser = plumber.getUser();

        if (plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE)
            throw new AuthorizationException("You are not available to accept jobs");

        if (plumberUser.getOnlineStatus() != OnlineStatus.ONLINE)
            throw new AuthorizationException("You must be online to accept a job");

        // ⭐⭐⭐⭐⭐ SUBSCRIPTION VALIDATION BEFORE ACCEPT ⭐⭐⭐⭐⭐
        subscriptionService.validatePlumberCanAcceptJob(plumberUser); // ⭐ ADDED

        job.setPlumber(plumber);
        job.setStatus(JobStatus.ACCEPTED);
        job.setAcceptedAt(LocalDateTime.now());

        jobRepository.save(job);

        // ⭐⭐⭐⭐⭐ RECORD PLUMBER USAGE ⭐⭐⭐⭐⭐
        subscriptionService.recordPlumberUsage(plumberUser); // ⭐ ADDED

        String profilePhotoUrl = null;
        if (plumberUser.getProfilePhotoFile() != null) {
            profilePhotoUrl = plumberUser.getProfilePhotoFile().getFileName();
        }

        String verificationStatus = "Verified";

        return new AcceptedPlumberResponse(
                plumberUser.getFullName(),
                profilePhotoUrl,
                plumberUser.getPhoneNumber(),
                verificationStatus
        );
    }

    @Override
    public CreateJobResponse terminateJobRequest(Long jobId) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Long userId = SecurityUtils.getCurrentUserId();

        if (!job.getCustomer().getId().equals(userId))
            throw new AuthorizationException("Not owner");

        if (job.getStatus() == JobStatus.ACCEPTED)
            throw new BadRequestException("Cannot cancel accepted job");

        job.setStatus(JobStatus.CANCELLED);
        job.setCancelledAt(LocalDateTime.now());

        jobRepository.save(job);

        return mapToResponse(job);
    }

    public List<JobHistoryResponse> jobHistoryRecord(Long ignored) {

        Long userId = SecurityUtils.getCurrentUserId();

        List<Job> jobs = jobRepository.findByCustomerId(userId);

        return jobs.stream()
                .map(j -> new JobHistoryResponse(
                        j.getId(),
                        j.getIssueDetails(),
                        j.getSubRegion().getId(),
                        j.getStatus(),
                        j.getCreatedAt(),
                        resolveFinalTime(j)
                ))
                .toList();
    }

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



















/**
 * Working Job service do not loose
 * */



//package com.WTFCapestone.Capestone.service.serviceImpl;
//
//import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
//import com.WTFCapestone.Capestone.dto.response.*;
//import com.WTFCapestone.Capestone.entity.*;
//import com.WTFCapestone.Capestone.exception.*;
//import com.WTFCapestone.Capestone.repository.*;
//import com.WTFCapestone.Capestone.security.SecurityUtils;
//import com.WTFCapestone.Capestone.service.JobMatchingService;
//import com.WTFCapestone.Capestone.service.JobService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class JobServiceImpl implements JobService {
//
//    private final JobRepository jobRepository;
//    private final UserRepository userRepository;
//    private final StateRepository stateRepository;
//    private final LocalGovernanceAreaRepository lgaRepository;
//    private final SubRegionRepository subRegionRepository;
//    private final JobMatchingService jobMatchingService;
//    private final PlumberProfileRepository plumberProfileRepository;
//
//    @Override
//    public CreateJobResponse newJob(CreateJobRequest request) {
//
//        Long customerId = SecurityUtils.getCurrentUserId();
//
//        User user = userRepository.findById(customerId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (user.getRole() != Role.CUSTOMER)
//            throw new AuthorizationException("Only customers can create jobs");
//
//        if (user.getOnlineStatus() != OnlineStatus.ONLINE)
//            throw new AuthorizationException("You must be online");
//
//        State state = stateRepository.findById(request.getStateId())
//                .orElseThrow(() -> new ResourceNotFoundException("State not found"));
//
//        LocalGovernanceArea lga = lgaRepository.findById(request.getLocalGovernanceId())
//                .orElseThrow(() -> new ResourceNotFoundException("LGA not found"));
//
//        SubRegion subRegion = subRegionRepository.findById(request.getSubregionId())
//                .orElseThrow(() -> new ResourceNotFoundException("SubRegion not found"));
//
//        Job job = Job.builder()
//                .customer(user)
//                .state(state)
//                .localGovernanceArea(lga)
//                .subRegion(subRegion)
//                .address(request.getAddress())
//                .issueDetails(request.getIssueDetails())
//                .status(JobStatus.LOGGED)
//                .expiresAt(LocalDateTime.now().plusSeconds(30))
//                .build();
//
//        job = jobRepository.saveAndFlush(job);
//
//        jobMatchingService.matchJobAsync(job.getId());
//
//        return mapToResponse(job);
//    }
//
//    @Override
//    public List<AvailableJobResponse> availableJobs() {
//
//        Long userId = SecurityUtils.getCurrentUserId();
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (user.getRole() != Role.PLUMBER)
//            throw new AuthorizationException("Only plumbers");
//
//        PlumberProfile plumber = plumberProfileRepository.findByUserId(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("Profile missing"));
//
//        if (user.getOnlineStatus() != OnlineStatus.ONLINE ||
//                plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE)
//            throw new AuthorizationException("Must be online & available");
//
//        List<Job> jobs = jobRepository.findAvailableMatchedJobs(
//                user.getSubRegion().getId(),
//                LocalDateTime.now()
//        );
//
//        return jobs.stream()
//                .map(j -> new AvailableJobResponse(
//                        j.getId(),
//                        j.getCustomer().getFullName(),
//                        null,
//                        j.getSubRegion().getId(),
//                        j.getAddress(),
//                        j.getIssueDetails(),
//                        j.getCreatedAt()
//                ))
//                .toList();
//    }
//
//    // ===============================
//    // ACCEPT JOB
//    // ===============================
//
//    //===============================
//    // ACCEPT JOB(OLD)
//    // ===============================
//    @Override
//    public AcceptedPlumberResponse acceptJob(Long jobId) {
//        //Fetch Job
//        Job job = jobRepository.findByIdForUpdate(jobId) .
//                orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//        // Job job = jobRepository.findById(jobId)
//        // .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//        // ✅ ADDED: prevent accepting expired job
//        if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(LocalDateTime.now())) {
//            throw new BadRequestException("Job has expired"); }
//
//        if (job.getStatus() == JobStatus.ACCEPTED) {
//            throw new BadRequestException("Job already accepted");
//        }
//
//        if (job.getStatus() == JobStatus.CANCELLED || job.getStatus() == JobStatus.COMPLETED) {
//            throw new BadRequestException("Job not available");
//        }
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        PlumberProfile plumber = plumberProfileRepository .findByUserId(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
//        // ✅ ADDED: ensure plumber is available
//        if (plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
//            throw new AuthorizationException("You are not available to accept jobs");
//        }
//        User plumberUser = plumber.getUser();
//        if (plumberUser.getOnlineStatus() != OnlineStatus.ONLINE) {
//            throw new AuthorizationException("You must be online to accept a job");
//        }
//
//        job.setPlumber(plumber);
//        job.setPlumber(plumber);
//        job.setStatus(JobStatus.ACCEPTED);
//        job.setAcceptedAt(LocalDateTime.now());
//
//        jobRepository.save(job);
//
//        // transaction ensures rollback safety String profilePhotoUrl = null;
//
//        String profilePhotoUrl = null;
//        if (plumberUser.getProfilePhotoFile() != null) {
//            profilePhotoUrl = plumberUser.getProfilePhotoFile().getFileName();
//        }
//        String verificationStatus = "Verified"; //this should not be hard corded
//
//        return new AcceptedPlumberResponse(
//                plumberUser.getFullName(),
//                profilePhotoUrl,
//                plumberUser.getPhoneNumber(),
//                verificationStatus );
//    }
//
//
//    @Override
//    public CreateJobResponse terminateJobRequest(Long jobId) {
//
//        Job job = jobRepository.findById(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        Long userId = SecurityUtils.getCurrentUserId();
//
//        if (!job.getCustomer().getId().equals(userId))
//            throw new AuthorizationException("Not owner");
//
//        if (job.getStatus() == JobStatus.ACCEPTED)
//            throw new BadRequestException("Cannot cancel accepted job");
//
//        job.setStatus(JobStatus.CANCELLED);
//        job.setCancelledAt(LocalDateTime.now());
//
//        jobRepository.save(job);
//
//        return mapToResponse(job);
//    }
//
//    public List<JobHistoryResponse> jobHistoryRecord(Long ignored) {
//
//        Long userId = SecurityUtils.getCurrentUserId();
//
//        List<Job> jobs = jobRepository.findByCustomerId(userId);
//
//        return jobs.stream()
//                .map(j -> new JobHistoryResponse(
//                        j.getId(),
//                        j.getIssueDetails(),
//                        j.getSubRegion().getId(),
//                        j.getStatus(),
//                        j.getCreatedAt(),
//                        resolveFinalTime(j)
//                ))
//                .toList();
//    }
//
//    private CreateJobResponse mapToResponse(Job job) {
//        return new CreateJobResponse(
//                job.getId(),
//                job.getCustomer().getId(),
//                job.getCustomer().getFullName(),
//                job.getCustomer().getPhoneNumber(),
//                job.getIssueDetails(),
//                job.getState().getId(),
//                job.getLocalGovernanceArea().getId(),
//                job.getSubRegion().getId(),
//                job.getAddress(),
//                job.getStatus(),
//                job.getCreatedAt()
//        );
//    }
//
//    private LocalDateTime resolveFinalTime(Job job) {
//
//        if (job.getCompletedAt() != null) return job.getCompletedAt();
//        if (job.getCancelledAt() != null) return job.getCancelledAt();
//        if (job.getAcceptedAt() != null) return job.getAcceptedAt();
//        if (job.getExpiresAt() != null) return job.getExpiresAt();
//
//        return job.getCreatedAt();
//    }
//}
