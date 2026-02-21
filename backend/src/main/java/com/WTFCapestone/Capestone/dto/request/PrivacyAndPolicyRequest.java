package com.WTFCapestone.Capestone.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@Setter
public class PrivacyAndPolicyRequest {
    private String version;
    private LocalDateTime effectiveDate;
    private MultipartFile file;
}


