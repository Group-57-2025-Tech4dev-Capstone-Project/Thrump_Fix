package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.AvailabilityStatus;
import com.WTFCapestone.Capestone.entity.OnlineStatus;
import com.WTFCapestone.Capestone.entity.VerificationStatus;
import lombok.*;

/**
 * DTO returned to frontend.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlumberProfileResponse {
    private Long plumberProfileId;

    private Long userId;

    private String fullName;

    private String phoneNumber;

    private String state;
    private String localGovernanceArea;
    private String subRegion;


    private String availabilityStatus;

    private boolean verified;


}
