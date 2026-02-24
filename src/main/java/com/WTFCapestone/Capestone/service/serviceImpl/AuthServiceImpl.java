package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.service.AuthService;
import com.WTFCapestone.Capestone.service.PlumberProfileService;
import com.WTFCapestone.Capestone.service.UserService;
import org.springframework.stereotype.Service;
import com.WTFCapestone.Capestone.dto.request.LoginRequest;
import com.WTFCapestone.Capestone.dto.request.PlumberProfileRequest;
import com.WTFCapestone.Capestone.dto.request.UserRegisterRequest;
import com.WTFCapestone.Capestone.dto.response.AuthResponse;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.repository.*;
import com.WTFCapestone.Capestone.security.TokenBlacklistService;
import com.WTFCapestone.Capestone.service.FileStorageService;
import com.WTFCapestone.Capestone.util.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

// 🔴 CHANGED: import custom exceptions
import com.WTFCapestone.Capestone.exception.AuthenticationException;
import com.WTFCapestone.Capestone.exception.BadRequestException;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private StateRepository stateRepository;
    @Autowired private LocalGovernanceAreaRepository lgaRepository;
    @Autowired private SubRegionRepository subRegionRepository;
    @Autowired private PrivacyAndPolicyRepository policyRepository;

    // ✅ CHANGED: use StoredFile repository for DB storage
    @Autowired private StoredFileRepository storedFileRepository;

    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private TokenBlacklistService blacklistService;

    @Autowired private UserService userService;
    @Autowired private PlumberProfileService plumberProfileService;

    //Here implement stateRole where customer can just click butoons(Customer or Plumber) then their role gets set.
//    Customers should not explicitly write or input that they are either Customer or plumber.
//    so when they get to register the chosen role gets to bet set on role filed needed on Register

    @Override
    public AuthResponse register(UserRegisterRequest request) {

        // ✅ 1. BASIC FIELD VALIDATION
        if (request.getPhoneNumber() == null || request.getPhoneNumber().length() < 10) {
            throw new BadRequestException("Invalid phone number");
        }

        // ✅ 2. CHECK DUPLICATES
        if (userRepository.existsByEmail(request.getEmail()))
            throw new BadRequestException("Email already registered");

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new BadRequestException("Phone number already registered");

        // ✅ 3. PRIVACY POLICY ACCEPTANCE
        // 🔴 CHANGED: now boolean checkbox logic
        if (request.getAcceptedPrivacyPolicy() == null || !request.getAcceptedPrivacyPolicy()) {
            throw new BadRequestException("You must accept Privacy & Policy");
        }

        // ✅ 4. ROLE SELECTION
        // 🔴 CHANGED: role selected BEFORE registration (UI step) //GOOD BUT: selected role is not yet set. here in the backend the selection is not yet implemented
        // Customers should not explicitly write or input that they are either Customer or plumber.
        // so when they get to register the chosen role gets to bet set on role filed needed on Register

        Role role;

        if (request.getRole() == null) {
            // 🔴 NEW: fallback safeguard (should never happen if UI works correctly)
            throw new BadRequestException("User role not provided");
        } else {
            role = request.getRole();
        }

        // 🔴 NEW: prevent illegal role injection
        if (role == Role.ADMIN) {
            throw new BadRequestException("Invalid role selection");
        }

        // 🔴 NEW: allow only public roles from UI buttons
        if (role != Role.CUSTOMER && role != Role.PLUMBER) {
            throw new BadRequestException("Unsupported role selected");
        }

        // ✅ 5. VALIDATE LOCATION
        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid state selection"));

        LocalGovernanceArea lga = lgaRepository.findById(request.getLocalGovernanceAreaId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid LGA selection"));

        SubRegion subRegion = subRegionRepository.findById(request.getSubRegionId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid subregion selection"));

        if (!subRegion.getLocalGovernanceArea().getId().equals(lga.getId())) {
            throw new BadRequestException("Subregion does not match selected LGA");
        }

        if (!lga.getState().getId().equals(state.getId())) {
            throw new BadRequestException("LGA does not belong to selected state");
        }

        // ✅ 6. STORE NATIONAL ID IN DATABASE  🔴 CHANGED
        if (request.getImage() == null || request.getImage().isEmpty()) {
            throw new BadRequestException("National ID is required");
        }

        StoredFile storedFile;
        try {
            if (!List.of("image/jpeg","image/png","image/jpg","application/pdf")
                    .contains(request.getImage().getContentType())) {
                throw new BadRequestException("Only JPG, PNG or PDF allowed");
            }

            storedFile = StoredFile.builder()
                    .fileName(request.getImage().getOriginalFilename())
                    .fileType(request.getImage().getContentType())
                    .data(request.getImage().getBytes())
                    .build();

            storedFile = storedFileRepository.save(storedFile);

        } catch (IOException e) {
            throw new BadRequestException("Failed to upload national ID");
        }

        // ✅ 7. CREATE USER
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role) // role chosen earlier via UI buttons
                .state(state)
                .localGovernanceArea(lga)
                .subRegion(subRegion)
                .verificationStatus(VerificationStatus.PENDING)
                .nationalIdFile(storedFile)
                .acceptedPrivacyAndPolicy(true)
                .acceptedPrivacyAndPolicyAt(LocalDateTime.now())
                .onlineStatus(OnlineStatus.OFFLINE)
                .enabled(true)
                .build();

        userRepository.save(user);

        // ✅ CREATE ROLE PROFILE
        // 🔴 CHANGED: plumber gets additional domain profile
        if (role == Role.PLUMBER) {
            PlumberProfileRequest plumberRequest = new PlumberProfileRequest();
            plumberRequest.setUserId(user.getId());
            plumberProfileService.createProfile(user.getId(), plumberRequest);
        }

        boolean profileCompleted = user.getNationalIdFile() != null;

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getVerificationStatus(),
                token,
                profileCompleted
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            // 🔴 CHANGED
            throw new AuthenticationException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                // 🔴 CHANGED
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // ✅ first login verification
        if (user.getVerificationStatus() == VerificationStatus.PENDING) {
            user.setVerificationStatus(VerificationStatus.VERIFIED);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getVerificationStatus(),
                token,
                true

        );
    }

    /**validates token
     * ✔ prepares for blacklist strategy
     * ✔ aligns with stateless JWT
     * Not usually necessary though because:
     * JWT Logout in Stateless APIs
     * JWT is stateless → server does NOT store sessions.
     */
    @Override
    public void logout(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token required for logout");
        }

        if (!jwtUtil.isTokenValid(token)) {
            throw new AuthenticationException("Invalid token");
        }

        // MVP: client deletes token.
        // Enterprise: add token to blacklist.
    }

}
