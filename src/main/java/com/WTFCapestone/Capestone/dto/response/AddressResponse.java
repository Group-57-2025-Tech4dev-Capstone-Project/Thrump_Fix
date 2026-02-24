package com.WTFCapestone.Capestone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponse {
    private Long id;
    private String houseNumberAndStreetName;
//    private String streetName;
    private String stateName;
    private String localGovernanceArea;

    private String subRegion;

//    private String landmark;
//    private String directions;
}
