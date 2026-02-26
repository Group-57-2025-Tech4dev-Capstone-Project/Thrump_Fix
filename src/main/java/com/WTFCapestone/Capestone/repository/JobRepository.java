package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCustomerId(Long customerId);

    List<Job> findByStatusAndSubRegionIdAndExpiresAtAfter(
            JobStatus status,
            Long subRegionId,
            LocalDateTime now
    );

    List<Job> findByStatusAndSubRegion_IdAndExpiresAtAfter(
            JobStatus status,
            Long subRegionId,
            LocalDateTime now
    );
}
