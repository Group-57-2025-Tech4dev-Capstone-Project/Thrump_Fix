package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.dto.request.AiMatchRequest;
import com.WTFCapestone.Capestone.dto.response.AiMatchResponse;
import com.WTFCapestone.Capestone.entity.Job;
import com.WTFCapestone.Capestone.service.AiAssistantService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


@Service
public class AiAssistantServiceImpl implements AiAssistantService {

    private final WebClient webClient;

    public AiAssistantServiceImpl(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("https://thrumpfix.onrender.com")
                .build();
    }

    @Override
    public AiMatchResponse matchPlumbers(Job job) {

        AiMatchRequest request = AiMatchRequest.builder()
                .jobId(job.getId())
                .region(job.getState().getName())
                .lga(job.getLocalGovernanceArea().getName())
                .lcda(job.getSubRegion().getName()) //lca
                .build();

//        Region -> 1 -> state,
//                Lga -> 2 -> lga,
//                lcda -> 3 -> subregion

        String rawResponse = webClient.post()
                .uri("/match")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("AI RESPONSE: " + rawResponse);

        try {
            return new ObjectMapper().readValue(rawResponse, AiMatchResponse.class);
        } catch (JsonProcessingException e) {
            // ✅ REPLACED RuntimeException
            throw new RuntimeException("Failed to parse AI response");
        }
    }
}