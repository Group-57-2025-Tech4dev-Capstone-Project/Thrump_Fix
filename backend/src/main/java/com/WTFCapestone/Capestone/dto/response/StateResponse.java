package com.WTFCapestone.Capestone.dto.response;

import com.WTFCapestone.Capestone.entity.LocalGovernanceArea;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StateResponse {
    private Long id;
    private String name;
}
