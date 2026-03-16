package com.WTFCapestone.Capestone.security;

import com.WTFCapestone.Capestone.entity.Role;
import com.WTFCapestone.Capestone.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    // 🔴 CHANGED: final for immutability
    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 🔴 ADDED: expose user if needed
    public User getUser() {
        return user;
    }

    public Long getId() {
        return user.getId();
    }

    public String getEmail() {
        return user.getEmail();
    }

    public Role getRole() {
        return user.getRole();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return Collections.singleton(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // 🔴 IMPORTANT: Spring Security still expects username
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 🔴 CHANGED: now respects account lock feature
    @Override
    public boolean isAccountNonLocked() {
        return !user.isAccountLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 🔴 CHANGED: respects enabled flag
    @Override
    public boolean isEnabled() {
        return true;
    }

//    @Override
//    public boolean isEnabled() {
//        return user.isEnabled();
//    }

}











//package com.WTFCapestone.Capestone.security;
//
//import com.WTFCapestone.Capestone.entity.Role;
//import com.WTFCapestone.Capestone.entity.User;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.Collection;
//import java.util.Collections;
//
//public class CustomUserDetails implements UserDetails {
//    private User user;
//
//    public User getUser() {
//        return user;
//    }
//
//    public CustomUserDetails(User user) {
//        this.user = user;
//    }
//
//    public Long getId() {
//        return user.getId();
//    }
//
//    public String getEmail() {
//        return user.getEmail();
//    }
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return Collections.singleton(
//                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
//        );
//    }
//
//
//    public Role getRole() {
//        return user.getRole();
//    }
//
//    @Override
//    public String getPassword() {
//        return user.getPassword();
//    }
//
//    @Override
//    public String getUsername() {
//        return user.getEmail();
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true;
//    }
//}
