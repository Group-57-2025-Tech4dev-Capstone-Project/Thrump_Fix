package com.WTFCapestone.Capestone.util;

import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.security.CustomUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Production-ready JWT utility class for generating and validating JWT tokens.
 */
@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    @Value("${jwt.issuer:CapestoneAuthService}")
    private String issuer;

    private SecretKey key;

    @PostConstruct
    public void init() {
        System.out.println("JWT SECRET LENGTH: " + jwtSecret.length());
        // Prepare secret key for signing
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT token using user's id, email, and role.
     */
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId())) // immutable userId as subject
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .setIssuer(issuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    /**
     * Extract userId (subject) from token.
     */
    public Long extractUserId(String token) {
        try {
            return Long.parseLong(parseClaims(token).getSubject());
        } catch (Exception e) {
            logger.warn("Failed to extract userId from JWT: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Extract email from token.
     */
    public String extractEmail(String token) {
        return parseClaims(token).get("email", String.class);
    }

    /**
     * Extract role from token.
     */
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * Check if token is expired.
     */
    private boolean isTokenExpired(String token) {
        return parseClaims(token)
                .getExpiration()
                .before(new Date());
    }

    /**
     * Validate token for a specific user.
     */
    public boolean isTokenValidForUser(String token, UserDetails userDetails) {
        try {
            Long userId = extractUserId(token);
            return (userId != null && userId.equals(((CustomUserDetails) userDetails).getId())
                    && !isTokenExpired(token));
        } catch (Exception e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Generic token validity check.
     */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Parse token claims.
     */
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .requireIssuer(issuer)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}





//    onsider using the Jwts.SIG.HS512.key() builder to create a key guaranteed to be secure enough for HS512.  See https://tools.ietf.org/html/rfc7518#section-3.2 for more information.




//package com.WTFCapestone.Capestone.util;
//
//import com.WTFCapestone.Capestone.entity.User;
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.nio.charset.StandardCharsets;
//import java.security.Key;
//import java.util.Date;
//
///**
// * Utility class for generating and validating JWT tokens.
// */
//@Component
//public class JwtUtil {
//    @Value("${jwt.secret}")
//    private String jwtSecret;
//
//    @Value("${jwt.expirationMs}")
//    private long jwtExpirationMs;
//
//    private SecretKey key;
//
//    @PostConstruct
//    public void init() {
//        // Prepare secret key for signing
//        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
//    }
//
//    private Key getSigningKey() {
//        // Convert string to proper Key
//        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
//    }
//
//    /**
//     * Generate JWT token using user's email and role.
//     */
//    public String generateToken(User user) {
//        return Jwts.builder()
//                .setSubject(user.getEmail())           // ✅ use email as subject
//                .claim("role", user.getRole().name())         // store role as claim
//                .claim("id", user.getId())
//                .claim("iss","CapestoneAuthService")
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
//                .signWith(key)
//                .compact();
//    }
//
//    /**
//     * Extract email (subject) from token.
//     */
//    public String extractUsername(String token) {
//        return parseClaims(token).getSubject();
//    }
//
//    public String getEmailFromJwt(String token) {
//        Claims claims = Jwts.parser()
//                .setSigningKey(getSigningKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//
//        return claims.getSubject();
//    }
//    /**
//     * Extract role from token.
//     */
//    public String extractRole(String token) {
//        return parseClaims(token).get("role", String.class);
//    }
//
//    /**
//     * Validate token expiration & signature.
//     */
//    public boolean isTokenValid(String token) {
//        try {
//            parseClaims(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    private boolean isTokenExpired(String token) {
//        return parseClaims(token)
//                .getExpiration()
//                .before(new Date());
//    }
//
//
//    public boolean isTokenValidForUser(String token, UserDetails userDetails) {
//        try {
//            final String username = extractUsername(token);
//            return (username.equals(userDetails.getUsername())
//                    && !isTokenExpired(token));
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
////    catch (Exception e) {
////        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
////        return;
////    }
//
//    /**
//     * Parse token claims.
//     */
//    private Claims parseClaims(String token) {
//        return Jwts.parser()
//                .setSigningKey(getSigningKey())
//                .requireIssuer("CapestoneAuthService")
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }



//}