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

    public boolean trialLimitReached() { //This is not so correct for customers, for customers usageCount gets to one as soon as the log a request yet  we promise
        return isTrial() && usageCount >= 1;
    }
}

//This is not so correct(trialLimitReached(it should be isTrial() && UsageCount && jobStatus.ACCEPTED >= 1) for customers, for customers usageCount gets to one as soon as the log a request yet  we promise,
//to end trial as soon as they get on job Accepted(jobStatus.ACCEPTED.
//Meaning if the user logs more than 20 jobs but no plumber gets to accept their request then their Free Trial will not be over.
//And for Plumbers as soon as the receive(accept) 1 job then their free trial ends. so the current works for Plumbers