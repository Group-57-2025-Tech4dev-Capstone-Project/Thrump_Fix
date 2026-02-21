package com.WTFCapestone.Capestone.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String newPassword;


//    private String email;
//    private String newPassword;
}
