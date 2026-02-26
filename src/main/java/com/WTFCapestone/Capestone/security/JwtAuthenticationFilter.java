package com.WTFCapestone.Capestone.security;

import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.repository.UserRepository;
import com.WTFCapestone.Capestone.service.CustomUserDetailsService;
import com.WTFCapestone.Capestone.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private TokenBlacklistService blacklistService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 🚀 Skip JWT filter for authentication endpoints
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

                // 🔴 1. Check blacklist FIRST
                if (blacklistService.isBlacklisted(token)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                // 🔴 2. Extract email safely
                String email = jwtUtil.extractUsername(token);

                // 🔴 3. Load user from DB
                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(email);

                // 🔴 4. VALIDATE TOKEN AGAINST USER
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

            } catch (ExpiredJwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token expired\"}");
                return; // 🔴 VERY IMPORTANT

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }



    private String extractToken(HttpServletRequest request) {

        // ✅ 1. Check Authorization header
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        // ✅ 2. Check HttpOnly cookie
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("thrumpfix_auth".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//
//            String email = jwtUtil.getEmailFromJwt(token);
//            System.out.println("Authenticated user: " + email);
//
//            if (blacklistService.isBlacklisted(token)) {
//                filterChain.doFilter(request, response);
//                return;
//            }
//            if (jwtUtil.isTokenValid(token)) {
//
//                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
//
//                UsernamePasswordAuthenticationToken authentication =
//                        new UsernamePasswordAuthenticationToken(
//                                userDetails,
//                                null,
//                                userDetails.getAuthorities()
//                        );
//
//                SecurityContextHolder.getContext()
//                        .setAuthentication(authentication);
//                System.out.println("Authorities: " + userDetails.getAuthorities());
//            }
//        }
//
//        filterChain.doFilter(request, response);
//
//    }
//
}
