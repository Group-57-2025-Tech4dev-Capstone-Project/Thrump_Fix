package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.LoginRequest;
import com.WTFCapestone.Capestone.dto.request.UserRegisterRequest;
import com.WTFCapestone.Capestone.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(UserRegisterRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String token);

}
