package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
import com.WTFCapestone.Capestone.dto.response.*;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.exception.*;
import com.WTFCapestone.Capestone.repository.*;
import com.WTFCapestone.Capestone.security.SecurityUtils;
import com.WTFCapestone.Capestone.service.JobMatchingService;
import com.WTFCapestone.Capestone.service.JobService;
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

    @Override
    public CreateJobResponse newJob(CreateJobRequest request) {

        Long customerId = SecurityUtils.getCurrentUserId();

        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.CUSTOMER)
            throw new AuthorizationException("Only customers can create jobs");

        if (user.getOnlineStatus() != OnlineStatus.ONLINE)
            throw new AuthorizationException("You must be online");

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
                .expiresAt(LocalDateTime.now().plusSeconds(30))
                .build();

        job = jobRepository.saveAndFlush(job);

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

    // ===============================
    // ACCEPT JOB
    // ===============================

    //===============================
    // ACCEPT JOB(OLD)
    // ===============================
    @Override
    public AcceptedPlumberResponse acceptJob(Long jobId) {
        //Fetch Job
        Job job = jobRepository.findByIdForUpdate(jobId) .
                orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        // Job job = jobRepository.findById(jobId)
        // .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        // ✅ ADDED: prevent accepting expired job
        if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Job has expired"); }

        if (job.getStatus() == JobStatus.ACCEPTED) {
            throw new BadRequestException("Job already accepted");
        }

        if (job.getStatus() == JobStatus.CANCELLED || job.getStatus() == JobStatus.COMPLETED) {
            throw new BadRequestException("Job not available");
        }
        Long loggedInUserId = SecurityUtils.getCurrentUserId();

        PlumberProfile plumber = plumberProfileRepository .findByUserId(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
        // ✅ ADDED: ensure plumber is available
        if (plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
            throw new AuthorizationException("You are not available to accept jobs");
        }
        User plumberUser = plumber.getUser();
        if (plumberUser.getOnlineStatus() != OnlineStatus.ONLINE) {
            throw new AuthorizationException("You must be online to accept a job");
        }

        job.setPlumber(plumber);
        job.setPlumber(plumber);
        job.setStatus(JobStatus.ACCEPTED);
        job.setAcceptedAt(LocalDateTime.now());

        jobRepository.save(job);

        // transaction ensures rollback safety String profilePhotoUrl = null;

        String profilePhotoUrl = null;
        if (plumberUser.getProfilePhotoFile() != null) {
            profilePhotoUrl = plumberUser.getProfilePhotoFile().getFileName();
        }
        String verificationStatus = "Verified"; //this should not be hard corded

        return new AcceptedPlumberResponse(
                plumberUser.getFullName(),
                profilePhotoUrl,
                plumberUser.getPhoneNumber(),
                verificationStatus );
    }

//    @Override
//    public AcceptedPlumberResponse acceptJob(Long jobId) {
//
//        Job job = jobRepository.findByIdForUpdate(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        if (job.getExpiresAt().isBefore(LocalDateTime.now())) {
//            job.setStatus(JobStatus.REJECTED);
//            jobRepository.save(job);
//            throw new BadRequestException("Job expired");
//        }
//
//        if (job.getStatus() == JobStatus.ACCEPTED)
//            throw new BadRequestException("Already accepted");
//
//        if (job.getStatus() != JobStatus.MATCHED)
//            throw new BadRequestException("Job not available");
//
//        Long userId = SecurityUtils.getCurrentUserId();
//
//        PlumberProfile plumber = plumberProfileRepository.findByUserId(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("Profile missing"));
//
//        job.setPlumber(plumber);
//        job.setStatus(JobStatus.ACCEPTED);
//        job.setAcceptedAt(LocalDateTime.now());
//
//        jobRepository.save(job);
//
//        User pUser = plumber.getUser();
//
//        return new AcceptedPlumberResponse(
//                pUser.getFullName(),
//                null,
//                pUser.getPhoneNumber(),
//                "Verified"
//        );
//    }

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












//package com.WTFCapestone.Capestone.service.serviceImpl;
//
//import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
//import com.WTFCapestone.Capestone.dto.response.AcceptedPlumberResponse;
//import com.WTFCapestone.Capestone.dto.response.AvailableJobResponse;
//import com.WTFCapestone.Capestone.dto.response.CreateJobResponse;
//import com.WTFCapestone.Capestone.dto.response.JobHistoryResponse;
//import com.WTFCapestone.Capestone.entity.*;
//import com.WTFCapestone.Capestone.exception.AuthorizationException;
//import com.WTFCapestone.Capestone.exception.BadRequestException;
//import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
//import com.WTFCapestone.Capestone.repository.*;
//import com.WTFCapestone.Capestone.security.SecurityUtils;
//import com.WTFCapestone.Capestone.service.JobMatchingService;
//import com.WTFCapestone.Capestone.service.JobService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
////please make sure Async or sync is handled properly as well as data roll back
//@Service
//@Transactional
//public class JobServiceImpl implements JobService {
//
//    @Autowired
//    private JobRepository jobRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private StateRepository stateRepository;
//
//    @Autowired
//    private LocalGovernanceAreaRepository lgaRepository;
//
//    @Autowired
//    private SubRegionRepository subRegionRepository;
//
//    @Autowired
//    private JobMatchingService jobMatchingService;
//
//    @Autowired
//    private PlumberProfileRepository plumberProfileRepository;
//
//
//
//    // ===============================
//    // CREATE JOB
//    // ===============================
//    @Override
//    public CreateJobResponse newJob(CreateJobRequest request) {
//
//        Long customerId = SecurityUtils.getCurrentUserId();
//
//        User user = userRepository.findById(customerId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (user.getRole() != Role.CUSTOMER) {
//            throw new AuthorizationException("Only customers can create jobs");
//        }
//
//        if (user.getOnlineStatus() != OnlineStatus.ONLINE) {
//            throw new AuthorizationException("You must be online to post a job");
//        }
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
//        jobRepository.saveAndFlush(job);
//
//        jobMatchingService.matchJobAsync(job.getId());
//
//        return mapToResponse(job);
//    }
//
//
//
//    // ===============================
//    // AVAILABLE JOBS
//    // ===============================
//    @Override
//    public List<AvailableJobResponse> availableJobs() {
//
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        User user = userRepository.findById(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (user.getRole() != Role.PLUMBER) {
//            throw new AuthorizationException("Only plumbers can view available jobs");
//        }
//
//        PlumberProfile plumber = plumberProfileRepository
//                .findByUserId(user.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
//
//        if (user.getOnlineStatus() != OnlineStatus.ONLINE ||
//                plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
//            throw new AuthorizationException("You must be online and available");
//        }
//
//        Long subRegionId = user.getSubRegion().getId();
//
//        List<Job> jobs = jobRepository
//                .findByStatusAndSubRegion_IdAndExpiresAtAfter(
//                        JobStatus.LOGGED,
//                        subRegionId,
//                        LocalDateTime.now()
//                );
//
//        return jobs.stream()
//                .map(job -> {
//
//                    String profilePhotoUrl = null;
//
//                    if (job.getCustomer().getProfilePhotoFile() != null) {
//                        profilePhotoUrl =
//                                job.getCustomer()
//                                        .getProfilePhotoFile()
//                                        .getFileName();
//                    }
//
//                    return new AvailableJobResponse(
//                            job.getId(),
//                            job.getCustomer().getFullName(),
//                            profilePhotoUrl,
//                            job.getSubRegion().getId(),
//                            job.getAddress(),
//                            job.getIssueDetails(),
//                            job.getCreatedAt()
//                    );
//                })
//                .toList();
//    }
//
//
//
//    // ===============================
//    // ACCEPT JOB
//    // ===============================
//    @Override
//    public AcceptedPlumberResponse acceptJob(Long jobId) {
//
//        // 🔴 FIX: use lock to prevent race conditions
//        Job job = jobRepository.findByIdForUpdate(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        // 🔴 NEW: only LOGGED jobs can be accepted //this needs to be revised  obvious a job has to be logged to called a job so this is not necessary
//        if (job.getStatus() == JobStatus.CANCELLED ||
//                job.getStatus() == JobStatus.COMPLETED) {
//            throw new BadRequestException("Job not available");
//        }
//
//        // 🔴 FIX: prevent accepting expired job
//        if (job.getExpiresAt() != null &&
//                job.getExpiresAt().isBefore(LocalDateTime.now())) {
//
//            if (job.getStatus() == JobStatus.LOGGED) {   // ✅ ADD THIS
//                job.setStatus(JobStatus.REJECTED);
//                jobRepository.save(job);
//            }
//
//            throw new BadRequestException("Job has expired");
//        }
//
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        PlumberProfile plumber = plumberProfileRepository //for now its ensuring here that only plumbers are accepting jobs
//                .findByUserId(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
//
//        if (plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
//            throw new AuthorizationException("You are not available to accept jobs");
//        }
//
//        User plumberUser = plumber.getUser();
//
//        if (plumberUser.getOnlineStatus() != OnlineStatus.ONLINE) {
//            throw new AuthorizationException("You must be online to accept a job");
//        }
//
//        job.setPlumber(plumber);
//        job.setStatus(JobStatus.ACCEPTED);
//        job.setAcceptedAt(LocalDateTime.now());
//
//        jobRepository.save(job);
//
//        String profilePhotoUrl = null;
//
//        if (plumberUser.getProfilePhotoFile() != null) {
//            profilePhotoUrl = plumberUser.getProfilePhotoFile().getFileName();
//        }
//
//        String verificationStatus = "Verified";
//
//        return new AcceptedPlumberResponse(
//                plumberUser.getFullName(),
//                profilePhotoUrl,
//                plumberUser.getPhoneNumber(),
//                verificationStatus
//        );
//    }
//
////    // ===============================
////    // ACCEPT JOB(OLD)//
////    // ===============================
////    @Override
////    public AcceptedPlumberResponse acceptJob(Long jobId) {
////        //Fetch Job
////        Job job = jobRepository.findByIdForUpdate(jobId) .
////                orElseThrow(() -> new ResourceNotFoundException("Job not found"));
////        // Job job = jobRepository.findById(jobId)
////        // .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
////        // ✅ ADDED: prevent accepting expired job
////        if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(LocalDateTime.now())) {
////            throw new BadRequestException("Job has expired"); }
////
////        if (job.getStatus() == JobStatus.ACCEPTED) {
////            throw new BadRequestException("Job already accepted");
////        }
////
////        if (job.getStatus() == JobStatus.CANCELLED || job.getStatus() == JobStatus.COMPLETED) {
////            throw new BadRequestException("Job not available");
////        }
////        Long loggedInUserId = SecurityUtils.getCurrentUserId();
////
////        PlumberProfile plumber = plumberProfileRepository .findByUserId(loggedInUserId)
////                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
////        // ✅ ADDED: ensure plumber is available
////        if (plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
////            throw new AuthorizationException("You are not available to accept jobs");
////        }
////        User plumberUser = plumber.getUser();
////        if (plumberUser.getOnlineStatus() != OnlineStatus.ONLINE) {
////            throw new AuthorizationException("You must be online to accept a job");
////        }
////
////        job.setPlumber(plumber);
////        job.setStatus(JobStatus.ACCEPTED);
////        job.setAcceptedAt(LocalDateTime.now());
////
////        jobRepository.save(job);
////
////        // transaction ensures rollback safety String profilePhotoUrl = null;
////
////        if (plumberUser.getProfilePhotoFile() != null) {
////            profilePhotoUrl = plumberUser.getProfilePhotoFile().getFileName();
////        }
////        String verificationStatus = "Verified"; //this should not be hard corded
////
////        return new AcceptedPlumberResponse(
////                plumberUser.getFullName(),
////                profilePhotoUrl,
////                plumberUser.getPhoneNumber(),
////                verificationStatus );
////    }
////    //so far so good the customer is not yet seeing the plumber's details can we enable that in the front end.
//
//    // ===============================
//    // CANCEL JOB
//    // ===============================
//    @Override
//    public CreateJobResponse terminateJobRequest(Long jobId) {
//
//        // 🔴 FIX: lock row
//        Job job = jobRepository.findByIdForUpdate(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        if (!job.getCustomer().getId().equals(loggedInUserId)) {
//            throw new AuthorizationException("You can only cancel your own job");
//        }
//
//        // 🔴 FIX: cannot cancel accepted
//        if (job.getStatus() == JobStatus.ACCEPTED ||
//                job.getStatus() == JobStatus.COMPLETED) {
//            throw new BadRequestException("Job can no longer be cancelled");
//        }
//
//        job.setStatus(JobStatus.CANCELLED);
//        job.setCancelledAt(LocalDateTime.now());
//
//        jobRepository.saveAndFlush(job); // 🔴 FIX
//
//        return mapToResponse(job);
//    }
//
//
//
//    // ===============================
//    // JOB HISTORY
//    // ===============================
//    @Override
//    public List<JobHistoryResponse> jobHistoryRecord(Long customerId) {
//
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        User customer = userRepository.findById(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
//
//        if (customer.getRole() != Role.CUSTOMER) {
//            throw new AuthorizationException("Only customers have job history");
//        }
//
//        List<Job> jobs = jobRepository.findByCustomerId(loggedInUserId);
//
//        return jobs.stream()
//                .map(job -> new JobHistoryResponse(
//                        job.getId(),
//                        job.getIssueDetails(),
//                        job.getSubRegion().getId(),
//                        job.getStatus(),
//                        job.getCreatedAt(),
//                        resolveFinalTime(job)
//                ))
//                .toList();
//        //add: lga, state, plumberFullname, plumberProfilePhoto and takeout sub region
//    }
//
//
//
//    // ===============================
//    // HELPERS
//    // ===============================
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








//package com.WTFCapestone.Capestone.service.serviceImpl;
//
//import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
//import com.WTFCapestone.Capestone.dto.response.AcceptedPlumberResponse;
//import com.WTFCapestone.Capestone.dto.response.AvailableJobResponse;
//import com.WTFCapestone.Capestone.dto.response.CreateJobResponse;
//import com.WTFCapestone.Capestone.dto.response.JobHistoryResponse;
//import com.WTFCapestone.Capestone.entity.*;
//import com.WTFCapestone.Capestone.exception.AuthorizationException;
//import com.WTFCapestone.Capestone.exception.BadRequestException;
//import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
//import com.WTFCapestone.Capestone.repository.*;
//import com.WTFCapestone.Capestone.security.SecurityUtils;
//import com.WTFCapestone.Capestone.service.JobMatchingService;
//import com.WTFCapestone.Capestone.service.JobService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
////please make sure Async or sync is handled properly as well as data roll back
//@Service
//@Transactional
//public class JobServiceImpl implements JobService {
//    @Autowired
//    private JobRepository jobRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private StateRepository stateRepository;
//
//    @Autowired
//    private LocalGovernanceAreaRepository lgaRepository;
//
//    @Autowired
//    private SubRegionRepository subRegionRepository;
//
//    @Autowired
//    private JobMatchingService jobMatchingService;
//
//    @Autowired
//    private PlumberProfileRepository plumberProfileRepository;
//
//    // ===============================
//    // CREATE JOB
//    // ===============================
//    @Override
//    public CreateJobResponse newJob(CreateJobRequest request) {
//
//        // ✅ CHANGED: get logged-in user instead of trusting request
//        Long customerId = SecurityUtils.getCurrentUserId();
//
//        // ✅ validate user
//        User user = userRepository.findById(customerId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (user.getRole() != Role.CUSTOMER) {
//            throw new AuthorizationException("Only customers can create jobs");
//        }
//
//        if (user.getOnlineStatus() != OnlineStatus.ONLINE) {
//            throw new AuthorizationException("You must be online to post a job");
//        }
//
//        // ✅ load location entities
//        State state = stateRepository.findById(request.getStateId())
//                .orElseThrow(() -> new ResourceNotFoundException("State not found"));
//
//        LocalGovernanceArea lga = lgaRepository.findById(request.getLocalGovernanceId())
//                .orElseThrow(() -> new ResourceNotFoundException("LGA not found"));
//
//        SubRegion subRegion = subRegionRepository.findById(request.getSubregionId())
//                .orElseThrow(() -> new ResourceNotFoundException("SubRegion not found"));
//
//        // ✅ create job
//        Job job = Job.builder()
//                .customer(user)
//                .state(state)
//                .localGovernanceArea(lga)
//                .subRegion(subRegion)
//                .address(request.getAddress())
//                .issueDetails(request.getIssueDetails())
//                .status(JobStatus.LOGGED)
//                .expiresAt(LocalDateTime.now().plusSeconds(30)) // MVP timer
//                //Check if the timer is even working(milliseconds)
//                .build();
//
//        jobRepository.saveAndFlush(job);   // commit immediately
//
//        // ✅ async AI matching
//        jobMatchingService.matchJobAsync(job.getId());
//
//        return mapToResponse(job);
//    }
//
//    // ===============================
//// Available Jobs
//// ===============================
//    @Override
//    public List<AvailableJobResponse> availableJobs() {
//
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        User user = userRepository.findById(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        // ✅ ensure plumber role
//        if (user.getRole() != Role.PLUMBER) {
//            throw new AuthorizationException("Only plumbers can view available jobs");
//        }
//
//        // ✅ plumber profile
//        PlumberProfile plumber = plumberProfileRepository
//                .findByUserId(user.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
//
//        // ✅ plumber must be online & available
//        if (user.getOnlineStatus() != OnlineStatus.ONLINE ||
//                plumber.getAvailabilityStatus() != AvailabilityStatus.AVAILABLE) {
//            throw new AuthorizationException("You must be online and available");
//        }
//
//        // ✅ Subregion comes from USER (NOT PlumberProfile)
//        Long subRegionId = user.getSubRegion().getId();
//
//        // ✅ fetch jobs still active
//        List<Job> jobs = jobRepository
//                .findByStatusAndSubRegion_IdAndExpiresAtAfter(
//                        JobStatus.LOGGED,
//                        subRegionId,
//                        LocalDateTime.now()
//                );
//
//        return jobs.stream()
//                .map(job -> {
//
//                    // ✅ profile photo safely extracted
//                    String profilePhotoUrl = null;
//
//                    if (job.getCustomer().getProfilePhotoFile() != null) {
//                        profilePhotoUrl =
//                                job.getCustomer()
//                                        .getProfilePhotoFile()
//                                        .getFileName(); // adjust if your StoredFile field name differs
//                    }
//
//                    return new AvailableJobResponse(
//                            job.getId(),
//                            job.getCustomer().getFullName(),
//                            profilePhotoUrl,
//                            job.getSubRegion().getId(),
//                            job.getAddress(),
//                            job.getIssueDetails(),
//                            job.getCreatedAt()
//                    );
//                })
//                .toList();
//    }
//    // ===============================
//    // ACCEPT JOB
//    // ===============================
//    @Override
////    @Transactional
//    public AcceptedPlumberResponse acceptJob(Long jobId) {
//
////        // 1️⃣ Fetch job
//        Job job = jobRepository.findByIdForUpdate(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
////        Job job = jobRepository.findById(jobId)
////                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        // 2️⃣ Validate job status
//        if (job.getStatus() == JobStatus.ACCEPTED) {
//            throw new BadRequestException("Job already accepted");
//        }
//
//        if (job.getStatus() == JobStatus.CANCELLED ||
//                job.getStatus() == JobStatus.COMPLETED) {
//            throw new BadRequestException("Job not available");
//        }
//
//        // 3️⃣ Get logged-in plumber
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        PlumberProfile plumber = plumberProfileRepository
//                .findByUserId(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("Plumber profile not found"));
//
//        // 4️⃣ Assign job
//        job.setPlumber(plumber);
//        job.setStatus(JobStatus.ACCEPTED);
//        job.setAcceptedAt(LocalDateTime.now());
//
//        jobRepository.save(job);
////        this too should appear on customer's job history with its job status
//
//        // 5️⃣ Map to response DTO
//        User plumberUser = plumber.getUser();
//
//        String profilePhotoUrl = null;
//        if (plumberUser.getProfilePhotoFile() != null) {
//            profilePhotoUrl = plumberUser.getProfilePhotoFile().getFileName(); // adjust if needed
//        }
//
//        String verificationStatus = "Verified"; // or derive from plumberUser fields if needed
//
//        return new AcceptedPlumberResponse(
//                plumberUser.getFullName(),
//                profilePhotoUrl,
//                plumberUser.getPhoneNumber(),
//                verificationStatus
//        ); // when a plumber accept a job the customer should see these details right now they are not appearing. the customer
//        //can only see Match found, Professional is on the way. please review unless its frontend lacking
//    }
//
//    // ===============================
//    // CANCEL JOB
//    // ===============================
//    @Override
//    public CreateJobResponse terminateJobRequest(Long jobId) {
//
//        Job job = jobRepository.findById(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        // ✅ CHANGED: only owner can cancel
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//        if (!job.getCustomer().getId().equals(loggedInUserId)) {
//            throw new AuthorizationException("You can only cancel your own job");
//        }
//
//        if (job.getStatus() == JobStatus.ACCEPTED ||
//                job.getStatus() == JobStatus.COMPLETED) {
//            throw new BadRequestException("Job can no longer be cancelled");
//        }
//
//        job.setStatus(JobStatus.CANCELLED);
//        job.setCancelledAt(LocalDateTime.now());
////        this too should appear in job history this is cancellation
//
//        return mapToResponse(job);
//    }
//
//    // ===============================
//    // JOB HISTORY (MVP VERSION)
//    // ===============================
//    public List<JobHistoryResponse> jobHistoryRecord(Long customerId) {
//
//        // ✅ CHANGED: ignore parameter and use logged-in user
//        Long loggedInUserId = SecurityUtils.getCurrentUserId();
//
//        User customer = userRepository.findById(loggedInUserId)
//                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
//
//        if (customer.getRole() != Role.CUSTOMER) {
//            throw new AuthorizationException("Only customers have job history");
//        }
//
//        List<Job> jobs = jobRepository.findByCustomerId(loggedInUserId);
//
//        return jobs.stream()
//                .map(job -> new JobHistoryResponse(
//                        job.getId(),
//                        job.getIssueDetails(),
//                        job.getSubRegion().getId(),
//                        job.getStatus(),
//                        job.getCreatedAt(),
//                        resolveFinalTime(job)
//                        // add the plumber who accepted the job if job status is ACCEPTED
//                        //if job status is equal to CANCELLED that job should appear on customers History
//                        //if job status is equal to ACCEPTED that job should appear on customers History too
//                        //Infact any logged Job despite where it ends in the job life cycle it should appear in a user's job history
////                        job history allows the customer to see all their activities related to jobs as long as they posted it
//                ))
//                .toList();
//    }
//
//    // ===============================
//    // HELPERS
//    // ===============================
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
