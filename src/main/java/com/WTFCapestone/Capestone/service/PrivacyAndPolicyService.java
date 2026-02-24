package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.dto.request.PrivacyAndPolicyRequest;
import com.WTFCapestone.Capestone.dto.response.PrivacyAndPolicyResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PrivacyAndPolicyService {
    PrivacyAndPolicyResponse createPolicy(PrivacyAndPolicyRequest request, MultipartFile file);

    List<PrivacyAndPolicyResponse> getAllPolicies();

    PrivacyAndPolicyResponse getLatestPolicy();

    void deletePolicy(Long id);
}
