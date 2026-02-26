package com.WTFCapestone.Capestone.service.serviceImpl;

import com.WTFCapestone.Capestone.entity.*;
import com.WTFCapestone.Capestone.exception.AuthorizationException;
import com.WTFCapestone.Capestone.repository.SubscriptionRepository;
import com.WTFCapestone.Capestone.service.SubscriptionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@Transactional
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    private static final Logger log =
            LoggerFactory.getLogger(SubscriptionServiceImpl.class);

    // =============================
    // START SUBSCRIPTION
    // =============================
    @Override
    public Subscription startSubscription(User user, SubscriptionPlan plan) {

        Subscription existing =
                subscriptionRepository.findByUser(user).orElse(null);

        if (existing != null && existing.getActive()) {
            throw new AuthorizationException(
                    "You already have an active subscription."
            );
        }

        Subscription sub = existing != null ? existing : new Subscription();

        sub.setUser(user);
        sub.setPlan(plan);
        sub.setUsageCount(0);
        sub.setStartDate(LocalDate.now());
        sub.setActive(true);

        if (plan == SubscriptionPlan.THRUMPFIX_PRO) {
            sub.setEndDate(LocalDate.now().plusMonths(1));
        } else {
            sub.setEndDate(null); // trial ends by usage
        }

        log.info("Subscription started for user {} with plan {}",
                user.getId(), plan);

        return subscriptionRepository.save(sub);
    }

    // =============================
    // VALIDATION BEFORE ACTIONS
    // =============================
    @Override
    public void validateCustomerCanPostJob(User user) {
        Subscription sub = getSubscription(user);
        validateActive(sub);

        if (sub.isTrial() && sub.trialLimitReached()) {
            throw new AuthorizationException(
                    "Trial finished. Upgrade to ThrumpFix Pro."
            );
        }
    }

    @Override
    public void validatePlumberCanAcceptJob(User user) {
        Subscription sub = getSubscription(user);
        validateActive(sub);

        if (sub.isTrial() && sub.trialLimitReached()) {
            throw new AuthorizationException(
                    "Trial finished. Upgrade to ThrumpFix Pro."
            );
        }
    }

    private void validateActive(Subscription sub) {

        if (!sub.getActive()) {
            throw new AuthorizationException("Subscription inactive.");
        }

        // 🔐 auto-expire PRO if date passed
        if (sub.getPlan() == SubscriptionPlan.THRUMPFIX_PRO &&
                sub.getEndDate() != null &&
                sub.getEndDate().isBefore(LocalDate.now())) {

            sub.setActive(false);
            subscriptionRepository.save(sub);

            throw new AuthorizationException("Subscription expired.");
        }
    }

    // =============================
    // USAGE TRACKING
    // =============================
    @Override
    public void recordCustomerUsage(User user) {
        recordUsage(user);
    }

    @Override
    public void recordPlumberUsage(User user) {
        recordUsage(user);
    }

    private void recordUsage(User user) {

        Subscription sub = getSubscription(user);

        if (!sub.getActive()) return;

        sub.setUsageCount(sub.getUsageCount() + 1);

        if (sub.isTrial() && sub.trialLimitReached()) {
            sub.setActive(false);
            log.info("Trial ended for user {}", user.getId());
        }

        subscriptionRepository.save(sub);
    }

    // =============================
    // GET SUBSCRIPTION
    // =============================
    @Override
    public Subscription getSubscription(User user) {
        return subscriptionRepository.findByUser(user)
                .orElseThrow(() ->
                        new AuthorizationException("Subscription not found"));
    }
}