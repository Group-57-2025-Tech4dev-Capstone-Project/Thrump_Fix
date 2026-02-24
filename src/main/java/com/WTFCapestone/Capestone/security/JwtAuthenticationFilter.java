package com.WTFCapestone.Capestone.security;

import com.WTFCapestone.Capestone.service.CustomUserDetailsService;
import com.WTFCapestone.Capestone.util.JwtUtil;
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

            String email = jwtUtil.getEmailFromJwt(token);
            System.out.println("Authenticated user: " + email);

            if (blacklistService.isBlacklisted(token)) {
                filterChain.doFilter(request, response);
                return;
            }
            if (jwtUtil.isTokenValid(token)) {

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
                System.out.println("Authorities: " + userDetails.getAuthorities());
            }
        }

        filterChain.doFilter(request, response);

    }

}
