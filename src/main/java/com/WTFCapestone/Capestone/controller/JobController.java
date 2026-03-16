package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.CreateJobRequest;
import com.WTFCapestone.Capestone.dto.response.AcceptedPlumberResponse;
import com.WTFCapestone.Capestone.dto.response.AvailableJobResponse;
import com.WTFCapestone.Capestone.dto.response.CreateJobResponse;
import com.WTFCapestone.Capestone.dto.response.JobHistoryResponse;
import com.WTFCapestone.Capestone.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ===============================
    // CREATE JOB (CUSTOMER)
    // ===============================
    @PostMapping
    public ResponseEntity<CreateJobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request) {

        return ResponseEntity.ok(jobService.newJob(request));
    }

    // ===============================
    // ACCEPT JOB (PLUMBER)
    // ===============================
    @PatchMapping("/{jobId}/accept")
    public ResponseEntity<?> acceptJob(@PathVariable Long jobId) {
        AcceptedPlumberResponse response = jobService.acceptJob(jobId);
        return ResponseEntity.ok(response);
    }


    // ===============================
    // CANCEL JOB (CUSTOMER ONLY)
    // ===============================
    @PatchMapping("/{jobId}/cancel")
    public ResponseEntity<CreateJobResponse> cancelJob(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.terminateJobRequest(jobId));
    }

    // ===============================
    // JOB HISTORY (CUSTOMER)
    // ===============================
    @GetMapping("/history")
    public ResponseEntity<List<JobHistoryResponse>> jobHistory() {

        return ResponseEntity.ok(jobService.jobHistoryRecord(null));
    }

    // ===============================
// AVAILABLE JOBS (PLUMBER)
// ===============================
    @GetMapping("/available")
    public ResponseEntity<List<AvailableJobResponse>> availableJobs() {
        return ResponseEntity.ok(jobService.availableJobs());
    }
}