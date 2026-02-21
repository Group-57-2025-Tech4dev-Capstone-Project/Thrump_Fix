package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.UserUpdateRequest;
import com.WTFCapestone.Capestone.dto.response.UserResponse;
import com.WTFCapestone.Capestone.entity.OnlineStatus;
import com.WTFCapestone.Capestone.entity.StoredFile;
import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.UserRepository;
import com.WTFCapestone.Capestone.service.FileStorageService;
import com.WTFCapestone.Capestone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller for general user management
 * user endpoints
 */
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // ✅ Get my profile
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    // ✅ Update my profile
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }

    // ✅ Upload profile photo
    @PostMapping("/users/{id}/profile-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @PathVariable Long id,
            @RequestParam MultipartFile file) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StoredFile storedFile = fileStorageService.store(file);

        user.setProfilePhotoFile(storedFile);
        userRepository.save(user);

        return ResponseEntity.ok("Profile photo uploaded");
    }

    // ✅ Update online status
    @PatchMapping("/me/status")
    public ResponseEntity<String> updateStatus(@RequestParam OnlineStatus status) {
        userService.updateOnlineStatus(status);
        return ResponseEntity.ok("Status updated successfully");
    }

    // ✅ Get user by ID (admin only)
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ✅ Delete my profile
    @DeleteMapping("/me")
    public ResponseEntity<String> deleteProfile() {
        userService.deleteUserProfile();
        return ResponseEntity.ok("User profile deleted successfully");
    }
}
