package com.WTFCapestone.Capestone.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UserUpdateRequest {
    private String fullName;

    private String phoneNumber;

    private Long stateId;
    private Long localGovernanceAreaId;
    private Long subRegionId;
    private MultipartFile profileImage;
}
