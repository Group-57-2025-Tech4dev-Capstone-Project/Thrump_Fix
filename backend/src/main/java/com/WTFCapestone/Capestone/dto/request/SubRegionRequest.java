package com.WTFCapestone.Capestone.dto.request;

import com.WTFCapestone.Capestone.entity.LocalGovernanceArea;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubRegionRequest {
    private String name;

    private Long localGovernanceAreaId;
}
