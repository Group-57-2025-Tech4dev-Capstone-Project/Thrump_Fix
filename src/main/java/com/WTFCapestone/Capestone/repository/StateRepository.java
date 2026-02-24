package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StateRepository extends JpaRepository<State, Long> {
    Optional<State> findStateByName(String name);

    Optional<State> findStateById(Long id);

    boolean existsByName(String name);

    Optional<State> findByNameIgnoreCase(String name); // ✅ use IgnoreCase for safety

    boolean existsByNameIgnoreCase(String name);
}
