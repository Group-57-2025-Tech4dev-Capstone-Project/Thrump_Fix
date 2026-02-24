package com.WTFCapestone.Capestone.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    /* UPDATED: lowercase for consistency */
    @NotBlank
    private String email;

    @NotBlank
    private String password;


}
