package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.Role;
import com.WTFCapestone.Capestone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Handles database operations for users.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);

    List<User> findUsersByRole(Role role);
    List<User> findByFullNameContainingIgnoreCase(String name);

    boolean existsById(Long id);
}
