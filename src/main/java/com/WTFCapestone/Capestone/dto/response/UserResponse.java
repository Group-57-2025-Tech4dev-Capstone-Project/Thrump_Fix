package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.OnlineStatus;
import com.WTFCapestone.Capestone.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * Response sent back to frontend.
  * NEVER expose password.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private Role role;

    private String state;
    private String localGovernanceArea;
    private String subRegion;
    private String verificationStatus;

    // 🔴 CHANGED: return safe metadata instead of entity
    private Long profilePhotoFileId;
    private String profilePhotoFileName;
    private String profilePhotoUrl;

    private OnlineStatus onlineStatus;
    private LocalDateTime createdAt;

    private boolean enabled;
}
