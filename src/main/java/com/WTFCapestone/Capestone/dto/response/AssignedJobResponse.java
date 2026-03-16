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
public class AssignedJobResponse {
    private Long jobId;
    private String issueDetails;
    private Long subRegionId;
    private JobStatus status;
    private LocalDateTime acceptedAt;
}
