package com.WTFCapestone.Capestone.repository;

import com.WTFCapestone.Capestone.entity.Subscription;
import com.WTFCapestone.Capestone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUser(User user);

}