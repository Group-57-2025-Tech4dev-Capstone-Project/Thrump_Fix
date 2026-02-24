package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.JobBroadcastRequest;
import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.PlumberProfile;
import com.WTFCapestone.Capestone.service.JobBroadcastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobBroadcastServiceImpl implements JobBroadcastService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void broadcastJob(JobBroadcastRequest job, List<PlumberProfile> plumbers) {

        for (PlumberProfile plumber : plumbers) {
            messagingTemplate.convertAndSend("/topic/jobs", job);
//            messagingTemplate.convertAndSend(
//                    "/topic/jobs/" + plumber.getUser().getId(),
//                    job
//            );
        }
    }

//    public void broadcastJob(Job job, List<AiMatchResponse.RecommendedPlumber> plumbers) {
//
//        for (AiMatchResponse.RecommendedPlumber plumber : plumbers) {
//            messagingTemplate.convertAndSend(
//                    "/topic/jobs/" + plumber.getPlumberId(),
//                    job
//            );
//        }
//    }
}
