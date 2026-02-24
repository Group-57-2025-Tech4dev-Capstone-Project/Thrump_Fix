package com.WTFCapestone.Capestone.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AiMatchRequest {

    private Long jobId;
    private String lga;
    private String lcda;
    private String region;
}
