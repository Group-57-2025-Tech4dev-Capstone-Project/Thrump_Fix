package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Generic file storage entity.
 * WHY:
 * - stores images & documents in DB
 * - reusable across the system
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "stored_files")
public class StoredFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* original file name */
    private String fileName;

    /* MIME type (image/png, application/pdf) */
    private String fileType;

    /* actual file bytes */
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;

    private LocalDateTime uploadedAt;

    @PrePersist
    void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
