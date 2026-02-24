package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.LocalGovernanceArea;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocalGovernanceAreaRepository extends JpaRepository<LocalGovernanceArea, Long> {
    List<LocalGovernanceArea> findByStateId(Long stateId);
//    List<LocalGovernanceArea> findById(Long Id);
//    List<LocalGovernanceArea> findByName(String Name);

    boolean existsByNameIgnoreCaseAndStateId(String name, Long stateId);

    Optional<LocalGovernanceArea> findByNameIgnoreCaseAndStateId(String name, Long stateId);
    Optional<LocalGovernanceArea> findByNameIgnoreCase(String name); // for global search by name

}
