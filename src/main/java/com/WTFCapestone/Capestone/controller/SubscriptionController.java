package com.WTFCapestone.Capestone.controller;

import com.WTFCapestone.Capestone.dto.request.SubscriptionRequest;
import com.WTFCapestone.Capestone.dto.response.SubscriptionResponse;
import com.WTFCapestone.Capestone.entity.Subscription;
import com.WTFCapestone.Capestone.entity.User;
import com.WTFCapestone.Capestone.service.SubscriptionService;
import com.WTFCapestone.Capestone.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserService userService;

    // =============================
    // START SUBSCRIPTION
    // =============================
    @PostMapping("/start")
    public ResponseEntity<SubscriptionResponse> startSubscription(
            @Valid @RequestBody SubscriptionRequest request) {

        User user = userService.getCurrentUserEntity();

        Subscription sub =
                subscriptionService.startSubscription(user, request.getPlan());

        return ResponseEntity.ok(mapToResponse(sub));
    }

    // =============================
    // GET MY SUBSCRIPTION
    // =============================
    @GetMapping("/me")
    public ResponseEntity<SubscriptionResponse> getMySubscription() {

        User user = userService.getCurrentUserEntity();

        Subscription sub =
                subscriptionService.getSubscription(user);

        return ResponseEntity.ok(mapToResponse(sub));
    }

    // =============================
    // MAPPER
    // =============================
    private SubscriptionResponse mapToResponse(Subscription sub) {
        return SubscriptionResponse.builder()
                .plan(sub.getPlan())
                .usageCount(sub.getUsageCount())
                .startDate(sub.getStartDate())
                .endDate(sub.getEndDate())
                .active(sub.getActive())
                .build();
    }
}