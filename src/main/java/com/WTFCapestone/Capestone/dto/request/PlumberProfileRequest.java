package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.AvailabilityStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlumberProfileRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Availability status required")
    private AvailabilityStatus availabilityStatus;

}
