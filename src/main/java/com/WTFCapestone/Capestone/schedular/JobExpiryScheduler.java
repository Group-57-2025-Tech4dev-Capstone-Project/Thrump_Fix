package com.WTFCapestone.Capestone.schedular;

import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.JobStatus;
import com.WTFCapestone.Capestone.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobExpiryScheduler {

    private final JobRepository jobRepository;

    /**
     * Runs every 5 seconds
     */
    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void expireJobs() {

        LocalDateTime now = LocalDateTime.now();

        List<Job> expiredJobs =
                jobRepository.findAllActiveExpiredJobs(now);

        if (expiredJobs.isEmpty()) {
            return;
        }

        log.info("Expiring {} jobs", expiredJobs.size());

        for (Job job : expiredJobs) {

            // 🔴 safety double check
            if (job.getStatus() == JobStatus.ACCEPTED ||
                    job.getStatus() == JobStatus.CANCELLED ||
                    job.getStatus() == JobStatus.COMPLETED) {
                continue;
            }

            job.setStatus(JobStatus.REJECTED);
            job.setRejectedAt(now);

//            log.info("Job {} expired and marked REJECTED", job.getId());
        }

        jobRepository.saveAll(expiredJobs);
    }
}
