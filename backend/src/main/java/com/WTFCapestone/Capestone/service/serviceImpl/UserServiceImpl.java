package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.UserUpdateRequest;
import com.WTFCapestone.Capestone.dto.response.UserResponse;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.exception.*;
import com.WTFCapestone.Capestone.repository.*;
import com.WTFCapestone.Capestone.service.FileStorageService;
import com.WTFCapestone.Capestone.util.JwtUtil;
import com.WTFCapestone.Capestone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

/**
 * Handles user registration and authentication.
 */
@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private LocalGovernanceAreaRepository lgaRepository;

    @Autowired
    private SubRegionRepository subRegionRepository;


    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private StoredFileRepository storedFileRepository;


    // ✅ GET CURRENT USER
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserResponse getMyProfile() {
        return map(getCurrentUser());
    }

    @Override
    public UserResponse updateProfile(UserUpdateRequest request) {
        User user = getCurrentUser();

        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user); // ✅ CHANGE: ensure persistence

        return map(user);
    }

    @Override
    public String uploadProfilePhoto(MultipartFile file) {
        // ✅ 1. GET CURRENT USER
        User user = getCurrentUser();

        // ✅ 2. VALIDATE FILE SIZE AND TYPE
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Profile photo file is required");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size must be <= 5MB");
        }
        if (!List.of("image/jpeg", "image/png", "image/jpg").contains(file.getContentType())) {
            throw new BadRequestException("Invalid file type. Only JPG, JPEG, PNG allowed");
        }

        try {
            // ✅ 3. STORE FILE IN DATABASE
            StoredFile storedFile = StoredFile.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .data(file.getBytes())
                    .build();

            storedFile = storedFileRepository.save(storedFile);

            // ✅ 4. ASSIGN TO USER
            user.setProfilePhotoFile(storedFile);
            userRepository.save(user);

            // ✅ 5. RETURN FILE NAME
            return storedFile.getFileName();

        } catch (IOException e) {
            // 🔴 CHANGED: convert technical error into business error
            throw new BadRequestException("Failed to process uploaded file");
        }
    }

    @Override
    public void updateOnlineStatus(OnlineStatus status) {
        User user = getCurrentUser();
        user.setOnlineStatus(status);
        userRepository.save(user); // ✅ CHANGE: persist update
    }

    @Override
    public UserResponse getUserById(Long id) {
        User current = getCurrentUser();

        if (!current.getRole().equals(Role.ADMIN)) {
            throw new AuthorizationException("Admin access required");
        }

        return map(userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    public void deleteUserProfile() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }

    // ✅ CHANGE: Rewrote mapper to use setters instead of constructor
    // ✅ CHANGE: Rewrote mapper to use setters instead of constructor
    UserResponse map(User user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        // location mapping
        response.setState(user.getState().getName());
        response.setLocalGovernanceArea(user.getLocalGovernanceArea().getName());
        response.setSubRegion(user.getSubRegion().getName());

        // verification status
        response.setVerificationStatus(user.getVerificationStatus().name());

        // 🔴 CHANGED: safe mapping for stored file
        if (user.getProfilePhotoFile() != null) {
            response.setProfilePhotoFileId(user.getProfilePhotoFile().getId());
            response.setProfilePhotoFileName(user.getProfilePhotoFile().getFileName());
        }

        response.setOnlineStatus(user.getOnlineStatus());
        response.setCreatedAt(user.getCreatedAt());
        response.setEnabled(user.getEnabled());

        return response;
    }
}
