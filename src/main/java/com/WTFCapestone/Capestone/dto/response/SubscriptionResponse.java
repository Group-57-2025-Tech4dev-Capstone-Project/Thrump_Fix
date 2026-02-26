package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.SubscriptionPlan;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class SubscriptionResponse {

    private SubscriptionPlan plan;
    private Integer usageCount;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active;

}