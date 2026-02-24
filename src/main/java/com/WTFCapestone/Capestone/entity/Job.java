package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "plumber_id")
    private PlumberProfile plumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "state_id")
    private State state;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "local_governance_area_id")
    private LocalGovernanceArea localGovernanceArea;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subregion_id")
    private SubRegion subRegion;

    private String address; //houseNumber, streetName


    private String issueDetails;

    private String aiMatchSummary;

    private Integer averageResponseMinutes;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private Integer etaMinutes; //createdAt = now ,expiresAt = now + 2 minutes(make it 5seconds)

//    private String countDown;
//    Timer;
//when the customer sends a job there should be a time counting down until they(customer) get connected to a plumber.
//    if no plumber found the job status should be updated to Rejected and be added to jon history.
//    then the customer can reload job again, until it gets accepted or the customer cancells the request.
//    how to add timerin this class/application
    private LocalDateTime createdAt;
    /* Automatically populate timestamps */
    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    private LocalDateTime expiresAt;
    private LocalDateTime matchedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    
}
