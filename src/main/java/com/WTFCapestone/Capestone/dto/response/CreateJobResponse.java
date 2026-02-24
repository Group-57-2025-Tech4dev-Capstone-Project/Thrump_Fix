package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateJobResponse {
    private Long jobId;
    private Long userId;
    private String userName;
    private String phoneNumber;
    private String issueDetails;
    private Long stateId;
    private Long localGovernanceId;
    private Long subRegionId;
    private String address;
    private JobStatus status;
    private LocalDateTime createdAt;
}
