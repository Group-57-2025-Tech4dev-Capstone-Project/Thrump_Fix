package com.WTFCapestone.Capestone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobBroadcastRequest {
    private Long jobId;
    private String issueDetails;
    private String address;
}
