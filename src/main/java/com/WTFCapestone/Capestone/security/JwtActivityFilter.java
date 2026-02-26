package com.WTFCapestone.Capestone.security;

import com.WTFCapestone.Capestone.entity.OnlineStatus;
import com.WTFCapestone.Capestone.repository.UserRepository;
import com.WTFCapestone.Capestone.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtActivityFilter extends OncePerRequestFilter {

    @Autowired private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            if (!jwtUtil.isTokenValid(token)) {

                String email = jwtUtil.extractUsername(token);

                userRepository.findByEmail(email).ifPresent(user -> {
                    user.setOnlineStatus(OnlineStatus.OFFLINE);
                    userRepository.save(user);
                });
            }
        }

        filterChain.doFilter(request, response);
    }
}
