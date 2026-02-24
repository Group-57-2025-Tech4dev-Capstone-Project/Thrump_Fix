package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCustomerId(Long customerId);
}
