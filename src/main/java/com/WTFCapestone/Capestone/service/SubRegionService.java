package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.SubRegionRequest;
import com.WTFCapestone.Capestone.dto.response.SubRegionResponse;

import java.util.List;

public interface SubRegionService {
    SubRegionResponse createSubRegion(SubRegionRequest request);

    List<SubRegionResponse> createBulkSubRegions(Long lgaId, List<String> names);

    List<SubRegionResponse> getAllSubRegions(Long lgaId);

    List<SubRegionResponse> getByLGA(Long lgaId);

    void deleteSubRegion(Long id);

    SubRegionResponse getSubRegionByName(String name);

    SubRegionResponse getSubRegionByNameAndLGA(String subName, Long lgaId);
}
