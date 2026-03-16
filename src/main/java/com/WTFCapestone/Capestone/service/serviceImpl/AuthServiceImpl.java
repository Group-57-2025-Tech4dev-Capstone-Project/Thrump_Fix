package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import com.WTFCapestone.Capestone.dto.request.LoginRequest;
import com.WTFCapestone.Capestone.dto.request.PlumberProfileRequest;
import com.WTFCapestone.Capestone.dto.request.UserRegisterRequest;
import com.WTFCapestone.Capestone.dto.response.AuthResponse;
import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.repository.*;
import com.WTFCapestone.Capestone.security.TokenBlacklistService;
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

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

  @Autowired
  private RefreshTokenService refreshTokenService;

    // 🔒 ACCOUNT LOCK CONFIGURATION
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MINUTES = 10;


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
        // 🔴 CHANGED: role selected BEFORE registration (UI step)
        Role role;

        if (request.getRole() == null) {
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

        // ✅ 6. STORE NATIONAL ID IN DATABASE
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
        // ✅ 7. CREATE USER
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .state(state)
                .localGovernanceArea(lga)
                .subRegion(subRegion)
                .verificationStatus(VerificationStatus.PENDING)
                .nationalIdFile(storedFile)
                .acceptedPrivacyAndPolicy(true)
                .acceptedPrivacyAndPolicyAt(LocalDateTime.now())
                .onlineStatus(OnlineStatus.OFFLINE)
                .enabled(true)

                // 🔐 NEW — account security defaults
                .accountLocked(false)          // 🔴 ADDED
                .failedLoginAttempts(0)        // 🔴 ADDED
                .lockTime(null)                // 🔴 ADDED

                .build();


        userRepository.save(user);

        // ✅ CREATE ROLE PROFILE
        if (role == Role.PLUMBER) {
            PlumberProfileRequest plumberRequest = new PlumberProfileRequest();
            plumberRequest.setUserId(user.getId());
            plumberProfileService.createProfile(user.getId(), plumberRequest);
        }

        boolean profileCompleted = user.getNationalIdFile() != null;

        // 🔴🔴🔴 CRITICAL SECURITY FIX BELOW 🔴🔴🔴

        // 🔴 CHANGED: generate token using fresh DB user
        User savedUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after save"));

        // 🔴 CHANGED: token MUST use email as subject
        // 🔐 generate access token
        String token = jwtUtil.generateToken(savedUser);

// 🔐 create refresh token
        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(savedUser.getId());

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getVerificationStatus(),
                savedUser.getOnlineStatus(),
                token,
                refreshToken.getToken(),   // ✅ NEW
                profileCompleted
        );
    }

    private  static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        // 🔒 CHECK ACCOUNT LOCK STATUS
        checkAccountLock(user);

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (BadCredentialsException e) {

            // 🔒 INCREASE FAILED ATTEMPTS
            increaseFailedAttempts(user);

            try { Thread.sleep(800); } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }

//            log.warn("Failed login attempt for email: {}", request.getEmail());

            throw new AuthenticationException("Invalid email or password");
        }

        // 🔓 RESET ATTEMPTS ON SUCCESS
        resetFailedAttempts(user);

        // ✅ SET USER ONLINE
        user.setOnlineStatus(OnlineStatus.ONLINE);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getVerificationStatus(),
                user.getOnlineStatus(),
                token,
                refreshToken.getToken(),
                true
        );
    }


    @Override
    public AuthResponse refreshToken(String requestToken) {

        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(requestToken)
                .orElseThrow(() -> new AuthenticationException("Invalid refresh token"));

        refreshTokenService.verifyExpiration(refreshToken);

        User user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new AuthenticationException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user);

        return new AuthResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getVerificationStatus(),
                user.getOnlineStatus(),
                newAccessToken,
                refreshToken.getToken(),
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

        // 🔴 CHANGED: extract userId instead of email
        Long userId = jwtUtil.extractUserId(token);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        // SET USER OFFLINE
        user.setOnlineStatus(OnlineStatus.OFFLINE);
        userRepository.save(user);

        // optional blacklist
        blacklistService.blacklistToken(token);
    }


    // 🔒 CHECK IF ACCOUNT IS LOCKED

    private void checkAccountLock(User user) {

        if (!user.isAccountLocked()) return;

        LocalDateTime unlockTime =
                user.getLockTime().plusMinutes(LOCK_DURATION_MINUTES);

        if (unlockTime.isBefore(LocalDateTime.now())) {

            user.setAccountLocked(false);
            user.setFailedLoginAttempts(0);
            user.setLockTime(null);

            userRepository.save(user);

        } else {

            long minutesLeft =
                    java.time.Duration.between(LocalDateTime.now(), unlockTime)
                            .toMinutes();

            throw new AuthenticationException(
                    "Account locked. Try again in " + minutesLeft + " minutes."
            );
        }
    }




//    private void checkAccountLock(User user) {
//
//        if (!user.isAccountLocked()) {
//            return;
//        }
//
//        LocalDateTime unlockTime =
//                user.getLockTime().plusMinutes(LOCK_DURATION_MINUTES);
//
//        if (unlockTime.isBefore(LocalDateTime.now())) {
//
//            // 🔓 unlock account
//            user.setAccountLocked(false);
//            user.setFailedLoginAttempts(0);
//            user.setLockTime(null);
//
//            userRepository.save(user);
//
//        } else {
//
//            throw new AuthenticationException(
//                    "Account locked due to multiple failed logins. Try again later."
//            );
//        }
//    }


    // 🔒 INCREASE FAILED ATTEMPTS
    private void increaseFailedAttempts(User user) {

        int attempts = user.getFailedLoginAttempts() + 1;

        user.setFailedLoginAttempts(attempts);

        if (attempts >= MAX_FAILED_ATTEMPTS) {

            user.setAccountLocked(true);
            user.setLockTime(LocalDateTime.now());

            log.warn("User account locked: {}", user.getEmail());
        }

        userRepository.save(user);
    }


    // 🔓 RESET FAILED ATTEMPTS AFTER SUCCESSFUL LOGIN
    private void resetFailedAttempts(User user) {

        if (user.getFailedLoginAttempts() > 0) {

            user.setFailedLoginAttempts(0);
            user.setAccountLocked(false);
            user.setLockTime(null);

            userRepository.save(user);
        }
    }

}
