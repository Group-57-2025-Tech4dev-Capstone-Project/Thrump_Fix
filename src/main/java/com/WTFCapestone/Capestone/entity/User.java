package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Represents system user.
 * Can be CUSTOMER or PLUMBER.
 * Central identity table for ALL users.
 * WHY:
 * - Centralizes authentication credentials
 * - Avoids duplicate email/password tables
 * - Supports role-based behavior
 */
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

//    @Column(length = 10, unique = true)
    @Column(unique = true)
    @Size(min = 10, max = 15) //place this in request dto
    private String phoneNumber;

    /* Email validation using Hibernate Validator */
    @Email(message = "Invalid email format")
    @Column(unique = true, nullable = false)
    private String email;

    /* Password will be hashed before saving */
    @Column(nullable = false)
    private String password;


    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToOne(optional = false)
    @JoinColumn(name = "state_id")
    private State state;

    @ManyToOne(optional = false)
    @JoinColumn(name = "local_governance_area_id")
    private LocalGovernanceArea localGovernanceArea;

    @ManyToOne(optional = false)
    @JoinColumn(name = "subregion_id")
    private SubRegion subRegion;
    /*CHANGED: Both Customers and Plumbers gets verified*/
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    /* national ID (private, verification only) */
    @OneToOne
    @JoinColumn(name = "national_id_file_id")
    private StoredFile nationalIdFile;

    /* profile photo (public display) */
    @OneToOne
    @JoinColumn(name = "profile_photo_file_id")
    private StoredFile profilePhotoFile;


    @OneToMany(mappedBy = "customer")
    private List<Job> jobs;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OnlineStatus onlineStatus = OnlineStatus.OFFLINE;


    private Boolean acceptedPrivacyAndPolicy;

    private LocalDateTime acceptedPrivacyAndPolicyAt;

    /* Enables future account activation */
    @Builder.Default
    private Boolean enabled = true;

    /* Audit fields */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /* Automatically populate timestamps */
    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // 🔒 ACCOUNT LOCK SECURITY
    @Column(name = "account_locked", nullable = false)
    @Builder.Default
    private boolean accountLocked = false;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "lock_time")
    private LocalDateTime lockTime;
}
