package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.AvailabilityStatus;
import com.WTFCapestone.Capestone.entity.PlumberProfile;
import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PlumberProfileRepository extends JpaRepository<PlumberProfile, Long> {
    Optional<PlumberProfile> findByUser(User user);

    Optional<PlumberProfile> findByUserId(Long userId);

    // ✅ Find by LGA
    List<PlumberProfile> findByUserLocalGovernanceAreaName(String localGovernanceArea);

    // ✅ Find by LGA + availability
    List<PlumberProfile> findByUserLocalGovernanceAreaNameAndAvailabilityStatus(
            String localGovernanceArea,
            AvailabilityStatus status
    );

    // ✅ Find by SubRegion
    List<PlumberProfile> findByUserSubRegionName(String subRegion);

    // ✅ Find by SubRegion + availability
    List<PlumberProfile> findByUserSubRegionNameAndAvailabilityStatus(
            String subRegion,
            AvailabilityStatus status
    );

    // ✅ Find by State
    List<PlumberProfile> findByUserStateName(String state);

    // ✅ Find by plumber name (from User entity)
    List<PlumberProfile> findByUserFullNameContainingIgnoreCase(String name);

    // ✅ Find by availability
    List<PlumberProfile> findByAvailabilityStatus(AvailabilityStatus status);

    @Query("""
SELECT p FROM PlumberProfile p
JOIN p.user u
WHERE p.id IN :ids
AND u.onlineStatus = 'ONLINE'
AND p.availabilityStatus = 'AVAILABLE'
AND p.user.verificationStatus = 'VERIFIED'
""")
    List<PlumberProfile> findOnlineAvailablePlumbersByIds(List<Long> ids);

    @Query("""
SELECT p FROM PlumberProfile p
WHERE p.user.subRegion.id = :subRegionId
AND p.availabilityStatus = 'AVAILABLE'
AND p.user.onlineStatus = 'ONLINE'
""")
    List<PlumberProfile> findFallbackPlumbersBySubRegion(
            Long subRegionId
    );
}
