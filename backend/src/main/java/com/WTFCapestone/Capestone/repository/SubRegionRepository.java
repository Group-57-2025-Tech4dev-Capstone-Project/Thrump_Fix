package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.SubRegion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubRegionRepository extends JpaRepository<SubRegion, Long> {

    List<SubRegion> findByLocalGovernanceAreaId(Long lgaId);
    List<SubRegion> findByLocalGovernanceAreaName(String lgaName);

    boolean existsByNameIgnoreCaseAndLocalGovernanceAreaId(String name, Long localGovernanceAreaId);

    Optional<SubRegion> findByNameIgnoreCaseAndLocalGovernanceAreaId(String name, Long lgaId);
    Optional<SubRegion> findByNameIgnoreCase(String name); // global search

}
