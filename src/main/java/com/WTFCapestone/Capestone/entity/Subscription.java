package com.WTFCapestone.Capestone.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private SubscriptionPlan plan;

    // tracks number of jobs used
    private Integer usageCount = 0;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean active = true;

    // =============================
    // BUSINESS LOGIC HELPERS
    // =============================

    public boolean isTrial() {
        return plan == SubscriptionPlan.FREE_TRIAL;
    }

    public boolean isPro() {
        return plan == SubscriptionPlan.THRUMPFIX_PRO;
    }

    public boolean trialLimitReached() {
        return isTrial() && usageCount >= 1;
    }
}