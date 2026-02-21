package com.WTFCapestone.Capestone.util;

import com.WTFCapestone.Capestone.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * Utility class for generating and validating JWT tokens.
 */
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        // Prepare secret key for signing
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    private Key getSigningKey() {
        // Convert string to proper Key
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT token using user's email and role.
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())           // ✅ use email as subject
                .claim("role", user.getRole().name())         // store role as claim
                .claim("id", user.getId())
                .claim("iss","CapestoneAuthService")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    /**
     * Extract email (subject) from token.
     */
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public String getEmailFromJwt(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
    /**
     * Extract role from token.
     */
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * Validate token expiration & signature.
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Parse token claims.
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
             //   .requireIssuer("CapestoneAuthService")
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
