package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.entity.JobBroadcast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface JobBroadcastRepository extends JpaRepository<JobBroadcast, Long> {

    @Query("""
        SELECT jb.job FROM JobBroadcast jb
        WHERE jb.plumber.id = :plumberId
        AND jb.job.status = 'MATCHED'
        AND jb.job.expiresAt > :now
    """)
    List<Job> findJobsBroadcastedToPlumber(Long plumberId, LocalDateTime now);
}