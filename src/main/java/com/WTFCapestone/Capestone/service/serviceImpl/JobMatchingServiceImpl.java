package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.JobBroadcastRequest;
import com.WTFCapestone.Capestone.dto.response.AiMatchResponse;
import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.JobStatus;
import com.WTFCapestone.Capestone.entity.PlumberProfile;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.JobRepository;
import com.WTFCapestone.Capestone.repository.PlumberProfileRepository;
import com.WTFCapestone.Capestone.service.AiAssistantService;
import com.WTFCapestone.Capestone.service.JobBroadcastService;
import com.WTFCapestone.Capestone.service.JobMatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobMatchingServiceImpl implements JobMatchingService {

    private final AiAssistantService aiAssistantService;
    private final JobBroadcastService broadcastService;
    private final JobRepository jobRepository;
    private final PlumberProfileRepository plumberProfileRepository;

    @Async("asyncExecutor")
    @Transactional
    @Override
    public void matchJobAsync(Long jobId) {

        try {

            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

            // 🔴 do not match expired jobs
            if (job.getExpiresAt().isBefore(LocalDateTime.now())) {
                job.setStatus(JobStatus.REJECTED);
                jobRepository.save(job);
                return;
            }

            job.setStatus(JobStatus.MATCHING);
            jobRepository.save(job);

            AiMatchResponse response = aiAssistantService.matchPlumbers(job);

            log.info("This is the response from AI {}",response);

            if (ObjectUtils.isEmpty(response) ||  ObjectUtils.isEmpty(response.getRecommendedPlumbers())) {

                job.setStatus(JobStatus.REJECTED);
                jobRepository.save(job);
                return;
            }


            List<Long> plumberIds = response.getRecommendedPlumbers()
                    .stream()
                    .map(AiMatchResponse.RecommendedPlumber::getPlumberId)
                    .toList();


            List<PlumberProfile> plumbers =
                    plumberProfileRepository.findAllById(plumberIds);

            // 🔴 AI returned ids but none exist in DB
            if (plumbers.isEmpty()) {
                job.setStatus(JobStatus.REJECTED);
                jobRepository.save(job);
                return;
            }

            job.setStatus(JobStatus.MATCHED);
            job.setMatchedAt(LocalDateTime.now());

            job.setAiMatchSummary(
                  //  response.getRecommendedPlumbers().get(0).getReason()
                    response.getRecommendedPlumbers().getFirst().getReason()
            );

            jobRepository.save(job);

            JobBroadcastRequest dto = new JobBroadcastRequest(
                    job.getId(),
                    job.getIssueDetails(),
                    job.getAddress()
            );

            broadcastService.broadcastJob(dto, plumbers);

        } catch (Exception ex) {

            // 🔴 safety fallback
            Job job = jobRepository.findById(jobId).orElse(null);
            if (job != null) {
                job.setStatus(JobStatus.REJECTED);
                jobRepository.save(job);
            }

            throw ex;
        }
    }
}










//package com.WTFCapestone.Capestone.service.serviceImpl;
//
//import com.WTFCapestone.Capestone.dto.request.AiMatchRequest;
//import com.WTFCapestone.Capestone.dto.request.JobBroadcastRequest;
//import com.WTFCapestone.Capestone.dto.response.AiMatchResponse;
//import com.WTFCapestone.Capestone.entity.Job;
//import com.WTFCapestone.Capestone.entity.JobStatus;
//import com.WTFCapestone.Capestone.entity.PlumberProfile;
//import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
//import com.WTFCapestone.Capestone.repository.JobRepository;
//import com.WTFCapestone.Capestone.repository.PlumberProfileRepository;
//import com.WTFCapestone.Capestone.service.AiAssistantService;
//import com.WTFCapestone.Capestone.service.JobBroadcastService;
//import com.WTFCapestone.Capestone.service.JobMatchingService;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//
//@Service
//@RequiredArgsConstructor
//public class JobMatchingServiceImpl implements JobMatchingService {
//
//    private final AiAssistantService aiAssistantService;
//    private final JobBroadcastService broadcastService;
//    private final JobRepository jobRepository;
//    private final PlumberProfileRepository plumberProfileRepository;
//
//    @Async("asyncExecutor")
//    @Transactional
//    public void matchJobAsync(Long jobId) {
//
//        // ✅ reload job safely inside async thread
//        Job job = jobRepository.findById(jobId)
//                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
//
//        job.setStatus(JobStatus.MATCHING);
//        jobRepository.save(job);
//
//        var response = aiAssistantService.matchPlumbers(job);
//
//        if (response == null ||
//                response.getRecommendedPlumbers() == null ||
//                response.getRecommendedPlumbers().isEmpty()) {
//
//            job.setStatus(JobStatus.REJECTED);
//            jobRepository.save(job);
//            return;
//        }
//
//        // ✅ convert AI plumber IDs → DB plumbers
//        List<Long> plumberIds = response.getRecommendedPlumbers()
//                .stream()
//                .map(AiMatchResponse.RecommendedPlumber::getPlumberId)
//                .toList();
//
//        List<PlumberProfile> plumbers =
//                plumberProfileRepository.findAllById(plumberIds);
//
//        job.setStatus(JobStatus.MATCHED);
//        job.setMatchedAt(LocalDateTime.now());
//
//        job.setAiMatchSummary(
//                response.getRecommendedPlumbers().get(0).getReason()
//        );
//
////
////        // ✅ broadcast job to matched plumbers
////        broadcastService.broadcastJob(job, plumbers);
//        jobRepository.save(job);
//
//// ✅ create safe broadcast payload (prevents JSON recursion)
//        JobBroadcastRequest dto = new JobBroadcastRequest(
//                job.getId(),
//                job.getIssueDetails(),
//                job.getAddress()
//        );
//
//// ✅ broadcast using DTO instead of entity
//        broadcastService.broadcastJob(dto, plumbers);
//    }
//
//}


