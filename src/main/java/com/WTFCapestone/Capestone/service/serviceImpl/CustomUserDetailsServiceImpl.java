package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.repository.UserRepository;
import com.WTFCapestone.Capestone.security.CustomUserDetails;
import com.WTFCapestone.Capestone.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new CustomUserDetails(user);
    }
}
