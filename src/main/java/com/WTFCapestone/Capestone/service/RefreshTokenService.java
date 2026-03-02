package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.entity.RefreshToken;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(Long userId);

    RefreshToken verifyExpiration(RefreshToken token);
}
