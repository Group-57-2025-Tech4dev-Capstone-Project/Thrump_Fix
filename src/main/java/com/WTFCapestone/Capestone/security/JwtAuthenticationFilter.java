package com.WTFCapestone.Capestone.security;

import com.WTFCapestone.Capestone.entity.User; // 🔴 ADDED
import com.WTFCapestone.Capestone.repository.UserRepository;
import com.WTFCapestone.Capestone.service.CustomUserDetailsService;
import com.WTFCapestone.Capestone.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final TokenBlacklistService blacklistService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getServletPath().startsWith("/api/auth");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {

                // 1️⃣ CHECK BLACKLIST
                if (blacklistService.isBlacklisted(token)) {
                    sendError(response, "TOKEN_REVOKED",
                            "Your session has been revoked. Please login again.");
                    return;
                }

                // 🔴 CHANGED: Extract USER ID instead of email
                Long userId = jwtUtil.extractUserId(token);

                if (userId == null) {
                    sendError(response, "INVALID_TOKEN",
                            "Invalid authentication token.");
                    return;
                }

                // 🔴 CHANGED: Load user using ID
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // 🔴 CHANGED: Load UserDetails using EMAIL
                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(user.getEmail()); //

                // VALIDATE TOKEN
                if (jwtUtil.isTokenValidForUser(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
//                System.out.println("TOKEN VALID: " + jwtUtil.isTokenValidForUser(token, userDetails));

            } catch (ExpiredJwtException e) {

                sendError(response,
                        "TOKEN_EXPIRED",
                        "Your session has expired. Please login again.");
                return;

            } catch (Exception e) {

                sendError(response,
                        "INVALID_TOKEN",
                        "Authentication failed. Please login.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response,
                           String error,
                           String message) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        response.getWriter().write("""
            {
              "error": "%s",
              "message": "%s"
            }
            """.formatted(error, message));
    }
}





















//package com.WTFCapestone.Capestone.security;
//
//import com.WTFCapestone.Capestone.repository.UserRepository;
//import com.WTFCapestone.Capestone.service.CustomUserDetailsService;
//import com.WTFCapestone.Capestone.util.JwtUtil;
//import io.jsonwebtoken.ExpiredJwtException;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.MediaType;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//
//@Component
//@RequiredArgsConstructor
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final JwtUtil jwtUtil;
//    private final UserRepository userRepository;
//    private final CustomUserDetailsService customUserDetailsService;
//    private final TokenBlacklistService blacklistService;
//
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        // Skip JWT filter for authentication endpoints
//        return request.getServletPath().startsWith("/api/auth");
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//
//            String token = authHeader.substring(7);
//
//            try {
//                // 1️⃣ Check blacklist FIRST
//                if (blacklistService.isBlacklisted(token)) {
//                    sendError(response, "TOKEN_REVOKED",
//                            "Your session has been revoked. Please login again.");
//                    return;
//                }
//
//                // 2️⃣ Extract email safely
//                String email = jwtUtil.extractUsername(token);
//
//                // 3️⃣ Load user from DB
//                UserDetails userDetails =
//                        customUserDetailsService.loadUserByUsername(email);
//
//                // 4️⃣ Validate token
//                if (jwtUtil.isTokenValidForUser(token, userDetails)) {
//
//                    UsernamePasswordAuthenticationToken authentication =
//                            new UsernamePasswordAuthenticationToken(
//                                    userDetails,
//                                    null,
//                                    userDetails.getAuthorities()
//                            );
//
//                    authentication.setDetails(
//                            new WebAuthenticationDetailsSource()
//                                    .buildDetails(request)
//                    );
//
//                    SecurityContextHolder.getContext()
//                            .setAuthentication(authentication);
//                }
//
//            } catch (ExpiredJwtException e) {
//                sendError(response,
//                        "TOKEN_EXPIRED",
//                        "Your session has expired. Please login again.");
//                return;
//
//            } catch (Exception e) {
//                sendError(response,
//                        "INVALID_TOKEN",
//                        "Authentication failed. Please login.");
//                return;
//            }
//        }
//
//        filterChain.doFilter(request, response);
//    }
//
//    /**
//     * Utility method to send structured JSON error responses
//     */
//    private void sendError(HttpServletResponse response,
//                           String error,
//                           String message) throws IOException {
//
//        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//
//        response.getWriter().write("""
//            {
//              "error": "%s",
//              "message": "%s"
//            }
//            """.formatted(error, message));
//    }
//
//    /**
//     * Extract token from header or cookie (optional use)
//     */
//    private String extractToken(HttpServletRequest request) {
//
//        String header = request.getHeader("Authorization");
//
//        if (header != null && header.startsWith("Bearer ")) {
//            return header.substring(7);
//        }
//
//        if (request.getCookies() != null) {
//            for (var cookie : request.getCookies()) {
//                if ("thrumpfix_auth".equals(cookie.getName())) {
//                    return cookie.getValue();
//                }
//            }
//        }
//
//        return null;
//    }
//}