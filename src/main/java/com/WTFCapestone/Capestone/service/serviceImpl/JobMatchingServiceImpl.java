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

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getExpiresAt().isBefore(LocalDateTime.now())) {
            job.setStatus(JobStatus.REJECTED);
            jobRepository.save(job);
            return;
        }

        job.setStatus(JobStatus.MATCHING);
        jobRepository.save(job);

        AiMatchResponse response = aiAssistantService.matchPlumbers(job);

//        log.info("This is the response from AI {}", response);

        log.info("AI RESPONSE: {}",
                response != null ? response.getRecommendedPlumbers() : null);

        List<PlumberProfile> plumbers = List.of();

        if (response != null && response.getRecommendedPlumbers() != null) {

            List<Long> aiIds = response.getRecommendedPlumbers()
                    .stream()
                    .map(AiMatchResponse.RecommendedPlumber::getPlumberId)
                    .toList();

            plumbers = plumberProfileRepository
                    .findOnlineAvailablePlumbersByIds(aiIds);
        }

        if (plumbers.isEmpty()) {
            log.warn("AI returned no VALID plumbers → using fallback matching");
        }


        // ⭐⭐⭐⭐⭐ FALLBACK MATCH ⭐⭐⭐⭐⭐
        if (plumbers.isEmpty()) {

            plumbers = plumberProfileRepository
                    .findFallbackPlumbersBySubRegion(
                            job.getSubRegion().getId()
                    );
        }

        if (plumbers.isEmpty()) {

            job.setStatus(JobStatus.REJECTED);
            job.setRejectedAt(LocalDateTime.now());
            jobRepository.save(job);

            return;
        }

        job.setStatus(JobStatus.MATCHED);
        job.setMatchedAt(LocalDateTime.now());
        jobRepository.save(job);

        JobBroadcastRequest dto = new JobBroadcastRequest(
                job.getId(),
                job.getIssueDetails(),
                job.getAddress()
        );

        broadcastService.broadcastJob(dto, plumbers);
    }
}

