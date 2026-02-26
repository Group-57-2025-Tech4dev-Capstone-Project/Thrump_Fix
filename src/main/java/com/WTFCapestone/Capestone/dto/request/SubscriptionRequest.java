package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.SubscriptionPlan;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionRequest {

    @NotNull
    private SubscriptionPlan plan; // FREE_TRIAL or THRUMPFIX_PRO

}