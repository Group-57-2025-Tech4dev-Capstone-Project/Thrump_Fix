package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.SubRegionRequest;
import com.WTFCapestone.Capestone.service.SubRegionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subregions")
public class SubRegionController {
    @Autowired
    private SubRegionService subRegionService;

    @PostMapping
    public ResponseEntity<?> createSubRegion(@RequestBody SubRegionRequest request) {
        return ResponseEntity.ok(subRegionService.createSubRegion(request));
    }

    @PostMapping("/bulk/{lgaId}")
    public ResponseEntity<?> createBulkSubRegions(@PathVariable Long lgaId,
                                                  @RequestBody List<String> names) {
        return ResponseEntity.ok(subRegionService.createBulkSubRegions(lgaId, names));
    }

    @GetMapping("/lga/{lgaId}")
    public ResponseEntity<?> getAllByLGA(@PathVariable Long lgaId) {
        return ResponseEntity.ok(subRegionService.getAllSubRegions(lgaId));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getByName(@PathVariable String name) {
        return ResponseEntity.ok(subRegionService.getSubRegionByName(name));
    }

//    @GetMapping("/lga/{name}")
//    public ResponseEntity<?> getByLgaName(@PathVariable String lgaName){
//        return ResponseEntity.ok(subRegionService.getSubRegionByLgaName(lgaName));
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubRegion(
            @PathVariable Long id,
            @RequestBody SubRegionRequest request) {

        return ResponseEntity.ok(subRegionService.updateSubRegion(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubRegion(@PathVariable Long id) {
        subRegionService.deleteSubRegion(id);
        return ResponseEntity.ok("SubRegion deleted successfully");
    }
}
