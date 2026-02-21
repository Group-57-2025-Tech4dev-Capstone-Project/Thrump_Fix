package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.StateRequest;
import com.WTFCapestone.Capestone.dto.response.StateResponse;
import com.WTFCapestone.Capestone.entity.State;
import com.WTFCapestone.Capestone.repository.StateRepository;
import com.WTFCapestone.Capestone.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class StateServiceImpl implements StateService {
    @Autowired
    private StateRepository stateRepository;


//    @Override
//    public StateResponse getState(String name) {
//        return null;
//    }

    @Override
    public StateResponse createState(StateRequest request) {

        if (stateRepository.existsByName(request.getName())) {
            throw new RuntimeException("State already exists");
        }

        State state = new State();
        state.setName(request.getName());

        State saved = stateRepository.save(state);

        return new StateResponse(saved.getId(), saved.getName());
    }


    /**
     * BULK CREATE STATES
     */
    @Override
//    @Transactional
    public List<StateResponse> createStatesBulk(List<StateRequest> requests) {

        List<State> statesToSave = new ArrayList<>();

        for (StateRequest req : requests) {

            if (!stateRepository.existsByNameIgnoreCase(req.getName())) {
                State state = new State();
                state.setName(req.getName());
                statesToSave.add(state);
            }
        }

        List<State> savedStates = stateRepository.saveAll(statesToSave);

        return savedStates.stream()
                .map(s -> new StateResponse(s.getId(), s.getName()))
                .toList();
    }


    @Override
    public StateResponse getStateByName(String name) {
        State state = stateRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("State not found: " + name));

        return new StateResponse(state.getId(), state.getName());
    }


    @Override
    public List<StateResponse> getAllStates() {
        return stateRepository.findAll()
                .stream()
                .map(s -> new StateResponse(s.getId(), s.getName()))
                .toList();
    }

    @Override
    public StateResponse getStateById(Long id) {
        State state = stateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found"));

        return new StateResponse(state.getId(), state.getName());
    }

    @Override
    public StateResponse updateState(Long id, StateRequest request) {

        State state = stateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found"));

        state.setName(request.getName());

        return new StateResponse(state.getId(), state.getName());
    }

    @Override
    public void deleteState(Long id) {
        State state = stateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("State not found"));

        stateRepository.delete(state);
    }
}
