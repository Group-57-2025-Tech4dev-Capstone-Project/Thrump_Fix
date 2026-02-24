package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
import com.WTFCapestone.Capestone.dto.response.CreateJobResponse;
import com.WTFCapestone.Capestone.dto.response.JobHistoryResponse;

import java.util.List;

public interface JobService {
    CreateJobResponse newJob(CreateJobRequest request);
    CreateJobResponse terminateJobRequest(Long jobId);

    void acceptJob(Long jobId, Long plumberId);
    List<JobHistoryResponse> jobHistoryRecord(Long customerId);

}
