package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.LocalGovernanceAreaRequest;
import com.WTFCapestone.Capestone.dto.response.LocalGovernanceAreaResponse;
import com.WTFCapestone.Capestone.entity.LocalGovernanceArea;
import com.WTFCapestone.Capestone.entity.State;
import com.WTFCapestone.Capestone.entity.SubRegion;
import com.WTFCapestone.Capestone.repository.LocalGovernanceAreaRepository;
import com.WTFCapestone.Capestone.repository.StateRepository;
import com.WTFCapestone.Capestone.repository.SubRegionRepository;
import com.WTFCapestone.Capestone.service.LocalGovernanceAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class LocalGovernanceAreaServiceImpl implements LocalGovernanceAreaService {
    @Autowired
    private LocalGovernanceAreaRepository lgaRepository;

    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private SubRegionRepository subRegionRepository;

    @Override
    public LocalGovernanceAreaResponse createLGA(LocalGovernanceAreaRequest request) {

        State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new RuntimeException("State not found"));

        if (lgaRepository.existsByNameIgnoreCaseAndStateId(
                request.getName(), request.getStateId())) {
            throw new RuntimeException("LGA already exists in this state");
        }

        LocalGovernanceArea lga = new LocalGovernanceArea();
        lga.setName(request.getName());
        lga.setState(state);

        LocalGovernanceArea savedLGA = lgaRepository.save(lga);

        // Save subregions if provided
        if (request.getSubRegions() != null) {
            for (String subName : request.getSubRegions()) {
                SubRegion sr = new SubRegion();
                sr.setName(subName);
                sr.setLocalGovernanceArea(savedLGA);
                subRegionRepository.save(sr);
            }
        }

        return new LocalGovernanceAreaResponse(
                savedLGA.getId(),
                savedLGA.getName()
        );
    }


    /**
     * BULK CREATE LGAs FOR A STATE
     */
    @Override
    @Transactional
    public List<LocalGovernanceAreaResponse> createBulkLGAs(
            Long stateId,
            List<String> lgaNames) {

        State state = stateRepository.findById(stateId)
                .orElseThrow(() -> new RuntimeException("State not found"));

        List<LocalGovernanceArea> lgas = new ArrayList<>();

        for (String name : lgaNames) {
            if (!lgaRepository.existsByNameIgnoreCaseAndStateId(name, stateId)) {
                LocalGovernanceArea lga = new LocalGovernanceArea();
                lga.setName(name);
                lga.setState(state);
                lgas.add(lga);
            }
        }

        return lgaRepository.saveAll(lgas)
                .stream()
                .map(l -> new LocalGovernanceAreaResponse(l.getId(), l.getName()))
                .toList();
    }

    /**
     * GET ALL LGAs BY STATE
     */
    @Override
    public List<LocalGovernanceAreaResponse> getAllLGA(Long stateId) {

        List<LocalGovernanceArea> lgas =
                lgaRepository.findByStateId(stateId);

        return lgas.stream()
                .map(l -> new LocalGovernanceAreaResponse(l.getId(), l.getName()))
                .toList();
    }

    @Override
    public List<LocalGovernanceAreaResponse> getByState(Long stateId) {
        return lgaRepository.findByStateId(stateId)
                .stream()
                .map(lga -> new LocalGovernanceAreaResponse(lga.getId(), lga.getName()))
                .toList();
    }

//    @Override
//    public List<LocalGovernanceAreaResponse> getByLGA(Long lgaId) {
//        return null;
//    }

    @Override
    public LocalGovernanceAreaResponse getLGAByName(String name) {
        LocalGovernanceArea lga = lgaRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("LGA not found: " + name));

        return new LocalGovernanceAreaResponse(lga.getId(), lga.getName());
    }


    public LocalGovernanceAreaResponse getLGAByNameAndState(String lgaName, Long stateId) {
        LocalGovernanceArea lga = lgaRepository
                .findByNameIgnoreCaseAndStateId(lgaName, stateId)
                .orElseThrow(() -> new RuntimeException(
                        "LGA '" + lgaName + "' not found in State ID: " + stateId));
        return new LocalGovernanceAreaResponse(lga.getId(), lga.getName());
    }


    @Override
    public LocalGovernanceAreaResponse updateLGA(Long id, LocalGovernanceAreaRequest request) {

        LocalGovernanceArea lga = lgaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LGA not found"));

        lga.setName(request.getName());

        return new LocalGovernanceAreaResponse(lga.getId(), lga.getName());
    }

    @Override
    public void deleteLGA(Long id) {
        LocalGovernanceArea lga = lgaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LGA not found"));

        lgaRepository.delete(lga);
    }

}
