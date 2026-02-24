package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.JobBroadcastRequest;
import com.WTFCapestone.Capestone.dto.response.AiMatchResponse;
import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.PlumberProfile;

import java.util.List;

public interface JobBroadcastService {
//    void broadcastJob(Job job, List<
//                AiMatchResponse.MatchedPlumber> plumbers);

//     void broadcastJob(Job job, List<AiMatchResponse.RecommendedPlumber> plumbers);

     void broadcastJob(JobBroadcastRequest job, List<PlumberProfile> plumbers);

//     void broadcastJob(Job job, List<PlumberProfile> plumbers);
}
