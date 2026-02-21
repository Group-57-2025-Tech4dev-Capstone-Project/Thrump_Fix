package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.response.StateResponse;
import com.WTFCapestone.Capestone.dto.request.StateRequest;
import com.WTFCapestone.Capestone.entity.State;

import java.util.List;
import java.util.Optional;

public interface StateService {

    StateResponse getStateByName(String name);

    StateResponse createState(StateRequest request);

    //CreateBulk

    List<StateResponse> getAllStates();

    StateResponse getStateById(Long id);

    StateResponse updateState(Long id, StateRequest request);

    void deleteState(Long id);

    List<StateResponse> createStatesBulk(List<StateRequest> requests);

}
