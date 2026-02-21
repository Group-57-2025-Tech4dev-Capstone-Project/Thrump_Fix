package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.StoredFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoredFileRepository extends JpaRepository<StoredFile, Long> {
}
