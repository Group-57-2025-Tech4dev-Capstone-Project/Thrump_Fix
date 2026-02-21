package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "plumber_id")
    private PlumberProfile plumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;

    private String description;

    private String issueCategory;

    private String aiSuggestion;

    private Integer averageResponseMinutes;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private String eta;
//    Timer;
//when the customer sends a job there should be a time counting down until theget connected to a pluber.
//    if no plumber found the job status should be updated to Rejected and be added to jon history.
//    then the customer can reload job again, until it gets accepted or the customer cancells the request.
//    how to add timerin this class/application
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private LocalDateTime matchedAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;

}
