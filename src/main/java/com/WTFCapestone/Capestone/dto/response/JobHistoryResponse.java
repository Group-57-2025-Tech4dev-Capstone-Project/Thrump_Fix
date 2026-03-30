package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class JobHistoryResponse {
    private Long jobId;
    private String issueDetails;
//    private Long subRegionId;
    private String stateName;
    private String localGovernmentName;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime finalStatusTime;
    private String plumberFullName;
    private String plumberPhoneNumber;
}
