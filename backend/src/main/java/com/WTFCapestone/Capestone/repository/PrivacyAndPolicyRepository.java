package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.PrivacyAndPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PrivacyAndPolicyRepository extends JpaRepository<PrivacyAndPolicy, Long> {
    Optional<PrivacyAndPolicy> findByVersion(String version);
//    Optional<PrivacyAndPolicy> findByDocumentUrl(String url);
    Optional<PrivacyAndPolicy> findByEffectiveDate(LocalDateTime effectiveDate);

    Optional<PrivacyAndPolicy> findTopByOrderByCreatedAtDesc();


//    Optional<PrivacyAndPolicy> findByActiveTrue();
}
