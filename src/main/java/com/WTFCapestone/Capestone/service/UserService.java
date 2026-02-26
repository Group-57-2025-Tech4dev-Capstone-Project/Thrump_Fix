package com.WTFCapestone.Capestone.service;


import com.WTFCapestone.Capestone.dto.request.LoginRequest;
import com.WTFCapestone.Capestone.dto.request.ResetPasswordRequest;
import com.WTFCapestone.Capestone.dto.request.UserRegisterRequest;
import com.WTFCapestone.Capestone.dto.request.UserUpdateRequest;
import com.WTFCapestone.Capestone.dto.response.AuthResponse;
import com.WTFCapestone.Capestone.dto.response.UserResponse;
import com.WTFCapestone.Capestone.entity.OnlineStatus;
import com.WTFCapestone.Capestone.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
//    User getCurrentUser();
    UserResponse getMyProfile();

    User getCurrentUserEntity();

    UserResponse updateProfile(UserUpdateRequest request);

    String uploadProfilePhoto(MultipartFile file);

    void updateOnlineStatus(OnlineStatus status);

    UserResponse getUserById(Long id); // admin only

    void deleteUserProfile();
}
