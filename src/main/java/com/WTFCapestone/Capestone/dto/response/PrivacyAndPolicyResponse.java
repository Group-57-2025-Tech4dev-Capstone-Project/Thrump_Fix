package com.WTFCapestone.Capestone.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PrivacyAndPolicyResponse {
    private Long id;
    private String version;
    private LocalDateTime effectiveDate;
    private LocalDateTime uploadedAt;
    // file info
    private String documentName;
}

