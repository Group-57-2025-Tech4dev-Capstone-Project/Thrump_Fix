package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.PrivacyAndPolicyRequest;
import com.WTFCapestone.Capestone.dto.response.PrivacyAndPolicyResponse;
import com.WTFCapestone.Capestone.entity.PrivacyAndPolicy;
import com.WTFCapestone.Capestone.entity.StoredFile;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.PrivacyAndPolicyRepository;
import com.WTFCapestone.Capestone.service.PrivacyAndPolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller to manage Privacy and Policy documents.
 * ✅ Only admin can create/delete policies. Users can fetch the latest version.
 */
@RestController
@RequestMapping("api/privacy-policy")
public class PrivacyAndPolicyController {
    @Autowired
    private PrivacyAndPolicyService policyService;

    @Autowired
    private PrivacyAndPolicyRepository repository;

    // ✅ Upload new policy
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PrivacyAndPolicyResponse> uploadPolicy(
            @RequestPart("version") String version,
            @RequestParam("effectiveDate") LocalDateTime effectiveDate,
            @RequestPart("file") MultipartFile file
    ) {

        PrivacyAndPolicyRequest request = new PrivacyAndPolicyRequest();
        request.setVersion(version);
        request.setEffectiveDate(effectiveDate);
        request.setFile(file);

        return ResponseEntity.ok(
                policyService.createPolicy(request, file)
        );
    }

    // ✅ Download policy document
    @GetMapping("/document/{id}")
    public ResponseEntity<byte[]> downloadPolicy(@PathVariable Long id) {

        PrivacyAndPolicy policy = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        StoredFile file = policy.getDocumentFile();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .body(file.getData());
    }

    // ✅ Get all policies
    @GetMapping("/all")
    public ResponseEntity<List<PrivacyAndPolicyResponse>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    // ✅ Get latest policy
    @GetMapping("/latest")
    public ResponseEntity<PrivacyAndPolicyResponse> getLatestPolicy() {
        return ResponseEntity.ok(policyService.getLatestPolicy());
    }

    // ✅ Delete policy
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok("Policy deleted successfully");
    }
}
