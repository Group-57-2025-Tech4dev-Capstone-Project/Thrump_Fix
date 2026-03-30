package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.JobBroadcastRequest;
import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.JobBroadcast;
import com.WTFCapestone.Capestone.entity.PlumberProfile;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.JobBroadcastRepository;
import com.WTFCapestone.Capestone.repository.JobRepository;
import com.WTFCapestone.Capestone.service.JobBroadcastService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobBroadcastServiceImpl implements JobBroadcastService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private JobBroadcastRepository jobBroadcastRepository;

    @Override
    @Transactional
    public void broadcastJob(JobBroadcastRequest dto, List<PlumberProfile> plumbers) {

        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        for (PlumberProfile plumber : plumbers) {

            JobBroadcast broadcast = JobBroadcast.builder()
                    .job(job)
                    .plumber(plumber)
                    .broadcastedAt(LocalDateTime.now())
                    .viewed(false)
                    .accepted(false)
                    .build();

            jobBroadcastRepository.save(broadcast);
        }
    }

}
