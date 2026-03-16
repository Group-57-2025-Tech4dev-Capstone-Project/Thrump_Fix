package com.WTFCapestone.Capestone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Returned to the customer when a plumber accepts a job.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AcceptedPlumberResponse {

    private String fullName;

    // Profile photo URL (can be null if none)
    private String profilePhotoUrl;

    private String phoneNumber;

    // Example: "Verified" or "Unverified"
    private String verificationStatus;
}