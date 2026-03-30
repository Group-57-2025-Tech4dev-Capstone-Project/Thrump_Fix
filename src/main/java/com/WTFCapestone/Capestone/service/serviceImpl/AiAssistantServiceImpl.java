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
import reactor.core.publisher.Mono;

import java.time.Duration;


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
//        String rawResponse = webClient.post()
//                .uri("/match")
//                .bodyValue(request)
//                .retrieve()
//                .bodyToMono(String.class)
//                .timeout(Duration.ofSeconds(10))
//                .onErrorReturn(null)
//                .block();

//        String rawResponse = webClient.post()
//                .uri("/match")
//                .bodyValue(request)
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();

        String rawResponse = webClient.post()
                .uri("/match")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(25))
                .onErrorResume(ex -> {
                    System.out.println("AI SERVICE FAILED: " + ex.getMessage());
                    return Mono.empty();
                })
                .block();

        System.out.println("AI RESPONSE: " + rawResponse);

        if (rawResponse == null) {
            return null; // ⭐ triggers fallback matching
        }

        try {
            return new ObjectMapper()
                    .readValue(rawResponse, AiMatchResponse.class);
        } catch (JsonProcessingException e) {
            System.out.println("AI PARSE FAILED");
            return null; // ⭐ also fallback
        }

    }
}

