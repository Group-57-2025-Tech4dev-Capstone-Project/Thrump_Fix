package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.SubRegionRequest;
import com.WTFCapestone.Capestone.dto.response.SubRegionResponse;
import com.WTFCapestone.Capestone.entity.LocalGovernanceArea;
import com.WTFCapestone.Capestone.entity.SubRegion;
import com.WTFCapestone.Capestone.repository.LocalGovernanceAreaRepository;
import com.WTFCapestone.Capestone.repository.SubRegionRepository;
import com.WTFCapestone.Capestone.service.SubRegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SubRegionServiceImpl implements SubRegionService {
    @Autowired
    private SubRegionRepository subRegionRepository;

    @Autowired
    private LocalGovernanceAreaRepository lgaRepository;

    @Override
    public SubRegionResponse createSubRegion(SubRegionRequest request) {

        LocalGovernanceArea lga = lgaRepository.findById(request.getLocalGovernanceAreaId())
                .orElseThrow(() -> new RuntimeException("LGA not found"));

        if (subRegionRepository.existsByNameIgnoreCaseAndLocalGovernanceAreaId(
                request.getName(), request.getLocalGovernanceAreaId())) {
            throw new RuntimeException("SubRegion already exists in this LGA");
        }

        SubRegion subRegion = new SubRegion();
        subRegion.setName(request.getName());
        subRegion.setLocalGovernanceArea(lga);

        SubRegion saved = subRegionRepository.save(subRegion);

        return new SubRegionResponse(saved.getId(), saved.getName());
    }


    /**
     * BULK CREATE SUBREGIONS
     */
    @Override
//    @Transactional
    public List<SubRegionResponse> createBulkSubRegions(
            Long lgaId,
            List<String> names) {

        LocalGovernanceArea lga = lgaRepository.findById(lgaId)
                .orElseThrow(() -> new RuntimeException("LGA not found"));

        List<SubRegion> list = new ArrayList<>();

        for (String name : names) {
            if (!subRegionRepository
                    .existsByNameIgnoreCaseAndLocalGovernanceAreaId(name, lgaId)) {

                SubRegion sr = new SubRegion();
                sr.setName(name);
                sr.setLocalGovernanceArea(lga);
                list.add(sr);
            }
        }

        return subRegionRepository.saveAll(list)
                .stream()
                .map(sr -> new SubRegionResponse(sr.getId(), sr.getName()))
                .toList();
    }

    /**
     * GET ALL SUBREGIONS BY LGA
     */
    @Override
    public List<SubRegionResponse> getAllSubRegions(Long lgaId) {

        List<SubRegion> list =
                subRegionRepository.findByLocalGovernanceAreaId(lgaId);

        return list.stream()
                .map(sr -> new SubRegionResponse(sr.getId(), sr.getName()))
                .toList();
    }

    @Override
    public List<SubRegionResponse> getByLGA(Long lgaId) {
        return subRegionRepository.findByLocalGovernanceAreaId(lgaId)
                .stream()
                .map(sr -> new SubRegionResponse(sr.getId(), sr.getName()))
                .toList();
    }

    @Override
    public void deleteSubRegion(Long id) {
        SubRegion sr = subRegionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubRegion not found"));

        subRegionRepository.delete(sr);
    }


    @Override
    public SubRegionResponse getSubRegionByName(String name) {
        SubRegion subRegion = subRegionRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("SubRegion not found: " + name));

        return new SubRegionResponse(subRegion.getId(), subRegion.getName());
    }


    public SubRegionResponse getSubRegionByNameAndLGA(String subName, Long lgaId) {
        SubRegion sr = subRegionRepository
                .findByNameIgnoreCaseAndLocalGovernanceAreaId(subName, lgaId)
                .orElseThrow(() -> new RuntimeException(
                        "SubRegion '" + subName + "' not found in LGA ID: " + lgaId));
        return new SubRegionResponse(sr.getId(), sr.getName());
    }

}
