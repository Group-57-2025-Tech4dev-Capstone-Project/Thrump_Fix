package com.WTFCapestone.Capestone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AvailableJobResponse {

    private Long jobId;

    private String customerFullName;
    private String customerProfilePicture;

    private Long subRegionId;
    private String address;

    private String issueDetails;

    private LocalDateTime createdAt;
}