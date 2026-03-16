package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.PlumberProfileRequest;
import com.WTFCapestone.Capestone.dto.response.AssignedJobResponse;
import com.WTFCapestone.Capestone.dto.response.PlumberProfileResponse;
import com.WTFCapestone.Capestone.entity.AvailabilityStatus;
import com.WTFCapestone.Capestone.service.PlumberProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



/**
 * Controller for plumber-specific actions
 * ✅ Only plumbers can manage their profiles
 */
@RestController
@RequestMapping("/api/plumbers")
public class PlumberProfileController {
    @Autowired
    private PlumberProfileService plumberService;

    // ✅ Get current plumber profile
    @GetMapping("/{userId}")
    public ResponseEntity<PlumberProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(plumberService.getProfile(userId));
    }


//     ✅ Update availability status
    @PatchMapping("/{userId}/availability")
    public ResponseEntity<PlumberProfileResponse> updateAvailability(
            @PathVariable Long userId,
            @RequestBody AvailabilityStatus status) {

        return ResponseEntity.ok(plumberService.updateAvailability(userId, status));
    }

//    // ✅ Update availability status
//    @PatchMapping("/{userId}/availability")
//    public ResponseEntity<PlumberProfileResponse> updateAvailability(
//            @PathVariable Long userId,
//            @RequestParam AvailabilityStatus status) {
//
//        return ResponseEntity.ok(plumberService.updateAvailability(userId, status));
//    }

    // ✅ Get all plumbers
    @GetMapping("/all")
    public ResponseEntity<List<PlumberProfileResponse>> getAllPlumbers() {
        return ResponseEntity.ok(plumberService.getAllPlumbers());
    }

    @GetMapping("/assigned-Jobs")
    public ResponseEntity<List<AssignedJobResponse>> getAssignedJobs(){
        return ResponseEntity.ok(plumberService.assignedJobs());
    }

    // ✅ Get plumbers by state
    @GetMapping("/state/{stateName}")
    public ResponseEntity<List<PlumberProfileResponse>> getByState(@PathVariable String stateName) {
        return ResponseEntity.ok(plumberService.getPlumbersByState(stateName));
    }

    // ✅ Get plumbers by LGA
    @GetMapping("/lga/{lga}")
    public ResponseEntity<List<PlumberProfileResponse>> getByLGA(@PathVariable String lga) {
        return ResponseEntity.ok(plumberService.getPlumberByLGA(lga));
    }

    // ✅ Get plumbers by name search
    @GetMapping("/search")
    public ResponseEntity<List<PlumberProfileResponse>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(plumberService.findByPlumberName(name));
    }

    // ✅ Delete plumber profile
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteProfile(@PathVariable Long userId) {
        plumberService.deleteProfile(userId);
        return ResponseEntity.ok("Plumber profile deleted successfully");
    }
}


