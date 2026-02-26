package com.WTFCapestone.Capestone.service;

import com.WTFCapestone.Capestone.entity.Subscription;
import com.WTFCapestone.Capestone.entity.SubscriptionPlan;
import com.WTFCapestone.Capestone.entity.User;

public interface SubscriptionService {

//    Subscription createFreeTrial(User user);
    Subscription getSubscription(User user);
    Subscription startSubscription(User user, SubscriptionPlan plan);

    void validateCustomerCanPostJob(User user);

    void validatePlumberCanAcceptJob(User user);

    void recordCustomerUsage(User user);

    void recordPlumberUsage(User user);

//    void activateProPlan(User user);
}