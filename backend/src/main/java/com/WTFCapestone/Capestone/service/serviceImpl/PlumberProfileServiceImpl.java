package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.response.UserResponse;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.exception.AuthorizationException;
import com.WTFCapestone.Capestone.exception.BadRequestException;
import com.WTFCapestone.Capestone.service.PlumberProfileService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.WTFCapestone.Capestone.dto.request.PlumberProfileRequest;
import com.WTFCapestone.Capestone.dto.response.PlumberProfileResponse;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.PlumberProfileRepository;
import com.WTFCapestone.Capestone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
@Transactional
public class PlumberProfileServiceImpl implements PlumberProfileService {

    @Autowired
    private PlumberProfileRepository plumberProfileRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ Create profile ONLY for plumbers
     */
    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }


    // ✅ GET USER
    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }


    // ✅ DTO MAPPER
    // 🔴 CHANGED: fixed incorrect mappings
    PlumberProfileResponse map(PlumberProfile profile) {

        PlumberProfileResponse response = new PlumberProfileResponse();

        response.setPlumberProfileId(profile.getId());
        response.setUserId(profile.getUser().getId());
        response.setFullName(profile.getUser().getFullName());
        response.setPhoneNumber(profile.getUser().getPhoneNumber());
        response.setState(profile.getUser().getState().getName());
        response.setLocalGovernanceArea(profile.getUser().getLocalGovernanceArea().getName());
        response.setSubRegion(profile.getUser().getSubRegion().getName());

        // 🔴 CHANGED: correct availability source
        response.setAvailabilityStatus(profile.getAvailabilityStatus().name());

        // 🔴 CHANGED: correct verification logic
        response.setVerified(
                profile.getUser().getVerificationStatus() == VerificationStatus.VERIFIED
        );

        return response;
    }


    // =========================================================

    @Override
    public PlumberProfileResponse createProfile(Long userId, PlumberProfileRequest request) {

        User user = getUser(userId);

        if (!user.getRole().equals(Role.PLUMBER)) {
            throw new BadRequestException("Only plumbers can create profiles");
        }

        if (plumberProfileRepository.findByUser(user).isPresent()) {
            throw new BadRequestException("Profile already exists");
        }

        PlumberProfile profile = new PlumberProfile();
        profile.setUser(user);
        profile.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);

        plumberProfileRepository.save(profile);

        return map(profile);
    }

    // =========================================================

    @Override
    public PlumberProfileResponse getProfile(Long userId) {
        return map(
                plumberProfileRepository.findByUserId(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Profile not found"))
        );
    }

    // =========================================================

    @Override
    public PlumberProfileResponse updateAvailability(Long userId, AvailabilityStatus status) {

        PlumberProfile profile = plumberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profile.setAvailabilityStatus(status);

        return map(profile);
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> getAllPlumbers() {
        return plumberProfileRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> getPlumberByLGA(String lga) {
        return plumberProfileRepository
                .findByUserLocalGovernanceAreaName(lga)
                .stream()
                .map(this::map)
                .toList();
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> findByPlumberName(String name) {
        return plumberProfileRepository
                .findByUserFullNameContainingIgnoreCase(name) // 🔴 CHANGED
                .stream()
                .map(this::map)
                .toList();
    }


    // =========================================================

    @Override
    public void deleteProfile(Long userId) {

        PlumberProfile profile = plumberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        plumberProfileRepository.delete(profile);
    }

    // =========================================================

    @Override
    public PlumberProfileResponse getPlumberAvailabilityStatus(Long userId) {

        PlumberProfile profile = plumberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        return map(profile);
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> getPlumbersByState(String state) {
        return plumberProfileRepository.findByUserStateName(state)
                .stream()
                .map(this::map)
                .toList();
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> getAllPlumbersBySubRegions(String subRegionName) {
        return plumberProfileRepository.findByUserSubRegionName(subRegionName)
                .stream()
                .map(this::map)
                .toList();
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> getAllPlumbersBySubRegionsAndAvailabilityStatus(
            String subRegionName,
            AvailabilityStatus status) {

        return plumberProfileRepository
                .findByUserSubRegionNameAndAvailabilityStatus(subRegionName, status)
                .stream()
                .map(this::map)
                .toList();
    }

    // =========================================================

    @Override
    public List<PlumberProfileResponse> getPlumberByLGAAndAvailabilityStatus(
            String lga,
            AvailabilityStatus status) {

        return plumberProfileRepository
                .findByUserLocalGovernanceAreaNameAndAvailabilityStatus(lga, status)
                .stream()
                .map(this::map)
                .toList();
    }
}