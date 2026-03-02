package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.entity.RefreshToken;
import com.WTFCapestone.Capestone.repository.RefreshTokenRepository;
import com.WTFCapestone.Capestone.service.RefreshTokenService;
import com.WTFCapestone.Capestone.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository repository;

    @Value("${jwt.refreshExpirationMs}")
    private Long refreshDurationMs;

    @Override
    public RefreshToken createRefreshToken(Long userId) {

        RefreshToken token = RefreshToken.builder()
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshDurationMs))
                .build();

        return repository.save(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {

        if (token.getExpiryDate().isBefore(Instant.now())) {
            repository.delete(token);
            throw new RuntimeException("Refresh token expired. Please login again.");
        }

        return token;
    }
}
