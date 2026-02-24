package com.WTFCapestone.Capestone.security;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static CustomUserDetails getCurrentUser() {
        return (CustomUserDetails)
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public static String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }
}
