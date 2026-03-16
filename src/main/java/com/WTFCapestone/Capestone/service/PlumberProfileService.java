package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.PlumberProfileRequest;
import com.WTFCapestone.Capestone.dto.response.AssignedJobResponse;
import com.WTFCapestone.Capestone.dto.response.PlumberProfileResponse;
import com.WTFCapestone.Capestone.entity.AvailabilityStatus;

import java.util.List;

public interface PlumberProfileService {

    PlumberProfileResponse createProfile(Long userId, PlumberProfileRequest request);

    PlumberProfileResponse getProfile(Long userId);

    PlumberProfileResponse updateAvailability(Long userId, AvailabilityStatus status);

    List<PlumberProfileResponse> getAllPlumbers();

    List<PlumberProfileResponse> getPlumberByLGA(String lga);

    List<PlumberProfileResponse> findByPlumberName(String name);

    void deleteProfile(Long userId);

    List<AssignedJobResponse> assignedJobs();

    // ✅ CHANGE: added userId
    PlumberProfileResponse getPlumberAvailabilityStatus(Long userId);

    List<PlumberProfileResponse> getPlumbersByState(String state);

    List<PlumberProfileResponse> getAllPlumbersBySubRegions(String subRegionName);

    // ✅ CHANGE: added availability status
    List<PlumberProfileResponse> getAllPlumbersBySubRegionsAndAvailabilityStatus(
            String subRegionName,
            AvailabilityStatus status
    );

    // ✅ CHANGE: added availability status
    List<PlumberProfileResponse> getPlumberByLGAAndAvailabilityStatus(
            String lga,
            AvailabilityStatus status
    );
}
