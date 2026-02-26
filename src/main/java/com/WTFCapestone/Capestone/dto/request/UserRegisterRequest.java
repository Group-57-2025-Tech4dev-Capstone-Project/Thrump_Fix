package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * Incoming registration payload.
 */
@Getter
@Setter
public class UserRegisterRequest {
    private MultipartFile image;

    @NotBlank
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 10, message = "Phone number must be at least 10 digits")
    private String phoneNumber;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*\\d).{6,}$",
            message = "Password must contain at least one uppercase letter and one digit"
    )
    private String password;

    private Role role;

    @NotNull
    private Long stateId;

    @NotNull
    private Long localGovernanceAreaId;

    @NotNull
    private Long subRegionId;

    @NotNull
    private Boolean acceptedPrivacyPolicy;
}
