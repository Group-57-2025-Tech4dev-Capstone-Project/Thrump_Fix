package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.repository.UserRepository;
import com.WTFCapestone.Capestone.security.CustomUserDetails;
import com.WTFCapestone.Capestone.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
//@RequiredArgsConstructor
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {

    // 🔴 CHANGED: constructor injection (recommended)
    private final UserRepository userRepository;

    public CustomUserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔴 REQUIRED by Spring Security UserDetailsService
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email)
                );

        return new CustomUserDetails(user);
    }
}



