package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.LocalGovernanceAreaRequest;
import com.WTFCapestone.Capestone.dto.response.LocalGovernanceAreaResponse;

import java.util.List;

public interface LocalGovernanceAreaService {

    LocalGovernanceAreaResponse createLGA(LocalGovernanceAreaRequest request);

    List<LocalGovernanceAreaResponse> createBulkLGAs(Long stateId, List<String> lgaNames);

    List<LocalGovernanceAreaResponse> getAllLGA(Long stateId);

    //creatBulk{to enable more than one state to be created at once}
    //<List> getAllLGA(Long stateId){return all the LGAs that falls under the given state id}

    List<LocalGovernanceAreaResponse> getByState(Long stateId);

    LocalGovernanceAreaResponse updateLGA(Long id, LocalGovernanceAreaRequest request);

    void deleteLGA(Long id);

    LocalGovernanceAreaResponse getLGAByName(String name);

    LocalGovernanceAreaResponse getLGAByNameAndState(String lgaName, Long stateId);

}
