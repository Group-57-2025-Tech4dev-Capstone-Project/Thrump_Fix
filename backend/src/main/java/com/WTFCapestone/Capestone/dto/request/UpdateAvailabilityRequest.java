package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.AvailabilityStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAvailabilityRequest {
    private AvailabilityStatus availabilityStatus;
}
