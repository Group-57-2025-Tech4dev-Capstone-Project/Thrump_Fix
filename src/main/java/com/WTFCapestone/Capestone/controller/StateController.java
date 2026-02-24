package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.StateRequest;
import com.WTFCapestone.Capestone.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/states")
public class StateController {
    @Autowired
    private StateService stateService;

    @PostMapping
    public ResponseEntity<?> createState(@RequestBody StateRequest request) {
        return ResponseEntity.ok(stateService.createState(request));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> createStatesBulk(@RequestBody List<StateRequest> requests) {
        return ResponseEntity.ok(stateService.createStatesBulk(requests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStateById(@PathVariable Long id) {
        return ResponseEntity.ok(stateService.getStateById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getStateByName(@PathVariable String name) {
        return ResponseEntity.ok(stateService.getStateByName(name));
    }

    @GetMapping
    public ResponseEntity<?> getAllStates() {
        return ResponseEntity.ok(stateService.getAllStates());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateState(@PathVariable Long id, @RequestBody StateRequest request) {
        return ResponseEntity.ok(stateService.updateState(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteState(@PathVariable Long id) {
        stateService.deleteState(id);
        return ResponseEntity.ok("State deleted successfully");
    }
}
