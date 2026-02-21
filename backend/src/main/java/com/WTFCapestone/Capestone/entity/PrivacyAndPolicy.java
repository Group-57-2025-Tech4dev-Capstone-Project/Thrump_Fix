package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Stores Privacy Policy versions.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrivacyAndPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String version;

    private LocalDateTime effectiveDate;

    /* link stored document */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_file_id")
    private StoredFile documentFile;

    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

}
