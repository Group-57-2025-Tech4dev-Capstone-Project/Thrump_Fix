package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.JobStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT j FROM Job j WHERE j.id = :jobId")
    Optional<Job> findByIdForUpdate(@Param("jobId") Long jobId);

    List<Job> findByPlumberId(Long plumberId);

//    List<Job> findAvailableMatchedJobs(Long id, LocalDateTime now);

    /**
     * ⭐ AVAILABLE JOBS FOR PLUMBERS
     * Only jobs:
     * - MATCHED
     * - not expired
     * - same subregion
     */
    @Query("""
            SELECT j FROM Job j
            WHERE j.status = com.WTFCapestone.Capestone.entity.JobStatus.MATCHED
            AND j.subRegion.id = :subRegionId
            AND j.expiresAt > :now
            """)
    List<Job> findAvailableMatchedJobs(
            @Param("subRegionId") Long subRegionId,
            @Param("now") LocalDateTime now
    );


    @Query("""
       SELECT j FROM Job j
       WHERE j.expiresAt < :now
       AND j.status NOT IN (
            com.WTFCapestone.Capestone.entity.JobStatus.ACCEPTED,
            com.WTFCapestone.Capestone.entity.JobStatus.CANCELLED,
            com.WTFCapestone.Capestone.entity.JobStatus.COMPLETED,
            com.WTFCapestone.Capestone.entity.JobStatus.REJECTED
       )
       """)
    List<Job> findAllActiveExpiredJobs(LocalDateTime now);

}
