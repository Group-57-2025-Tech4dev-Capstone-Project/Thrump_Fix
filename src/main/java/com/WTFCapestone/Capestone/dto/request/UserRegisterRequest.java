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
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number required")
    private String phoneNumber;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Role required")
    private Role role;  //making sure that the roles used has are the exact roles defined in our Role enum

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "National ID photo is required")
    private MultipartFile image;

    @NotNull(message = "Please select sate")
    private Long stateId;

    @NotNull(message = "Please select Local Governance Area")
    private Long localGovernanceAreaId;

    @NotNull(message = "Please select region")
    private Long subRegionId;

    @NotNull(message = "Privacy & Policy is empty")
    private Boolean acceptedPrivacyPolicy;

//    @NotNull(message = "You must accept Privacy & Policy")
//    private String acceptedPrivacyPolicy;

//    @NotBlank(message = "Privacy and Policy missing")
//    private String acceptedPrivacyAndPolicyVersion; //What if this becomes a boolean that gets true when a user tick the Privacy and policy box

}
