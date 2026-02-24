package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.LoginRequest;
import com.WTFCapestone.Capestone.dto.request.ResetPasswordRequest;
import com.WTFCapestone.Capestone.dto.request.UserRegisterRequest;
import com.WTFCapestone.Capestone.dto.response.AuthResponse;
import com.WTFCapestone.Capestone.dto.response.UserResponse;
import com.WTFCapestone.Capestone.entity.Role;
import com.WTFCapestone.Capestone.exception.AuthenticationException;
import com.WTFCapestone.Capestone.exception.BadRequestException;
import com.WTFCapestone.Capestone.service.AuthService;
import com.WTFCapestone.Capestone.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomBooleanEditor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Handles authentication operations:
 * ✔ Registration
 * ✔ Login
 * ✔ Logout
 */

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    // =========================================================
    // ✅ REGISTER USER
    // =========================================================
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody UserRegisterRequest request // supports MultipartFile upload
    ) {
        return ResponseEntity.ok(authService.register(request));
    }


    @PostMapping(value = "register/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> uploadImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("password") String password,
            @RequestParam("role") String role,
            @RequestParam("stateId") String stateId,
            @RequestParam("localGovernanceAreaId") String localGovernanceAreaId,
            @RequestParam("subRegionId") String subRegionId,
            @RequestParam("acceptedPrivacyPolicy") String acceptedPrivacyPolicy
    ) {

        UserRegisterRequest request = new UserRegisterRequest();

        // ✅ populate request object
        request.setImage(image);
        request.setFullName(fullName);
        request.setEmail(email);
        request.setPhoneNumber(phoneNumber);
        request.setPassword(password);

        // ✅ convert role string → enum
        request.setRole(Role.valueOf(role.toUpperCase()));

        request.setStateId(Long.valueOf(stateId));
        request.setLocalGovernanceAreaId(Long.valueOf(localGovernanceAreaId));
        request.setSubRegionId(Long.valueOf(subRegionId));

        // ✅ convert checkbox string → boolean
        request.setAcceptedPrivacyPolicy(
                acceptedPrivacyPolicy.equalsIgnoreCase("true") ||
                        acceptedPrivacyPolicy.equalsIgnoreCase("on")
        );

        return ResponseEntity.ok(authService.register(request));
    }


    // =========================================================
    // ✅ LOGIN USER
    // =========================================================
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(authService.login(request));
    }

    // =========================================================
    // ✅ LOGOUT USER
    // =========================================================
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AuthenticationException("Authorization token missing");
        }

        String token = authHeader.substring(7);
        authService.logout(token);

        return ResponseEntity.ok("Logged out successfully");
    }
}
