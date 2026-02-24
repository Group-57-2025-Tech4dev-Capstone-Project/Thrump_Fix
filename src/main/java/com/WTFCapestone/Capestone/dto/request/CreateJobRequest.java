package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateJobRequest {
//    @NotNull
//    private Long userId;
    @NotNull
    private Long stateId;
    @NotNull
    private Long localGovernanceId;
    @NotNull
    private Long subregionId;
    @NotBlank
    private String address; //houseNumber, streetName

    @NotBlank
    private String issueDetails;
}
