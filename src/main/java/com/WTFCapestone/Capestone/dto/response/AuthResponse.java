package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.OnlineStatus;
import com.WTFCapestone.Capestone.entity.Role;
import com.WTFCapestone.Capestone.entity.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long userId;

    private String fullName;

    private String email;

    private Role role;

    private VerificationStatus verificationStatus;

    private OnlineStatus onlineStatus;

    private String token;

    private boolean profileCompleted;


}
