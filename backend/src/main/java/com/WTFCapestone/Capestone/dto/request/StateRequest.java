package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.LocalGovernanceArea;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class StateRequest {

    @NotBlank
    private String name;
}
