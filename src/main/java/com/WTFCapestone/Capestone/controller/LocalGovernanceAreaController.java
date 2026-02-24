package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.LocalGovernanceAreaRequest;
import com.WTFCapestone.Capestone.service.LocalGovernanceAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/lgas")
public class LocalGovernanceAreaController {
    @Autowired
    private LocalGovernanceAreaService lgaService;

    @PostMapping
    public ResponseEntity<?> createLGA(@RequestBody LocalGovernanceAreaRequest request) {
        return ResponseEntity.ok(lgaService.createLGA(request));
    }

    @PostMapping("/bulk/{stateId}")
    public ResponseEntity<?> createBulkLGAs(@PathVariable Long stateId,
                                            @RequestBody List<String> lgaNames) {
        return ResponseEntity.ok(lgaService.createBulkLGAs(stateId, lgaNames));
    }

    @GetMapping("/state/{stateId}")
    public ResponseEntity<?> getAllLGAs(@PathVariable Long stateId) {
        return ResponseEntity.ok(lgaService.getAllLGA(stateId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLGAById(@PathVariable Long id) {

        return ResponseEntity.ok(lgaService.getByState(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getLGAByName(@PathVariable String name) {
        return ResponseEntity.ok(lgaService.getLGAByName(name));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLGA(@PathVariable Long id,
                                       @RequestBody LocalGovernanceAreaRequest request) {
        return ResponseEntity.ok(lgaService.updateLGA(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLGA(@PathVariable Long id) {
        lgaService.deleteLGA(id);
        return ResponseEntity.ok("LGA deleted successfully");
    }
}
