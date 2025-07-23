package com.charllson.ems_backend.respository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.charllson.ems_backend.model.onboarding.OnBoarding;

public interface OnboardingRepository extends JpaRepository<OnBoarding, Long> {
    Optional<OnBoarding> findByUserId(Long userId);
}
