package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.PrivacyAndPolicyRequest;
import com.WTFCapestone.Capestone.dto.response.PrivacyAndPolicyResponse;
import com.WTFCapestone.Capestone.entity.PrivacyAndPolicy;
import com.WTFCapestone.Capestone.entity.StoredFile;
import com.WTFCapestone.Capestone.exception.BadRequestException;
import com.WTFCapestone.Capestone.exception.ResourceNotFoundException;
import com.WTFCapestone.Capestone.repository.PrivacyAndPolicyRepository;
import com.WTFCapestone.Capestone.repository.StoredFileRepository;
import com.WTFCapestone.Capestone.service.FileStorageService;
import com.WTFCapestone.Capestone.service.PrivacyAndPolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrivacyAndPolicyServiceImpl implements PrivacyAndPolicyService {
    @Autowired
    private PrivacyAndPolicyRepository policyRepository;

    @Autowired
    private StoredFileRepository storedFileRepository;

    @Override
    public PrivacyAndPolicyResponse createPolicy(PrivacyAndPolicyRequest request, MultipartFile file) {

        if (request.getVersion() == null || request.getVersion().isBlank()) {
            throw new BadRequestException("Policy version is required");
        }

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Policy document is required");
        }

        try {
            // ✅ store file in DB
            StoredFile storedFile = StoredFile.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .data(file.getBytes())
                    .build();

            storedFile = storedFileRepository.save(storedFile);

            // ✅ create policy
            PrivacyAndPolicy policy = PrivacyAndPolicy.builder()
                    .version(request.getVersion())
                    .effectiveDate(request.getEffectiveDate())
                    .documentFile(storedFile)
                    .build();

            policyRepository.save(policy);

            return mapToResponse(policy);

        } catch (IOException e) {
            throw new BadRequestException("Failed to store policy document");
        }
    }

    @Override
    public List<PrivacyAndPolicyResponse> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PrivacyAndPolicyResponse getLatestPolicy() {
        PrivacyAndPolicy policy = policyRepository
                .findTopByOrderByCreatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("No policy found"));

        return mapToResponse(policy);
    }

    @Override
    public void deletePolicy(Long id) {
        PrivacyAndPolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        policyRepository.delete(policy);
    }

    private PrivacyAndPolicyResponse mapToResponse(PrivacyAndPolicy policy) {
        return PrivacyAndPolicyResponse.builder()
                .id(policy.getId())
                .version(policy.getVersion())
                .effectiveDate(policy.getEffectiveDate())
                .uploadedAt(policy.getCreatedAt())
                .documentName(policy.getDocumentFile().getFileName())
                .build();
    }
}
