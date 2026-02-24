package com.WTFCapestone.Capestone.dto.request;


import com.WTFCapestone.Capestone.entity.State;
import com.WTFCapestone.Capestone.entity.SubRegion;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class LocalGovernanceAreaRequest {
    private String name;
    /*  use ID not entity */
    private Long stateId;

    private Set<String> subRegions;
}
