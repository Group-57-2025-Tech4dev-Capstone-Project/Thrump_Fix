package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class JobHistoryResponse {
    private Long jobId;
    private Long subRegionId;
    private JobStatus status;
    private LocalDateTime finalStatusTime;
}
