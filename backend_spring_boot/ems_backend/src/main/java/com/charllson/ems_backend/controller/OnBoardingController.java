package com.charllson.ems_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.OnboardingRequest;
import com.charllson.ems_backend.helpers.OnboardingResponse;
import com.charllson.ems_backend.helpers.UserProfileDto;
import com.charllson.ems_backend.model.onboarding.OnBoarding;
import com.charllson.ems_backend.respository.OnboardingRepository;
import com.charllson.ems_backend.services.OnboardingService;
import com.charllson.ems_backend.users.User;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping(path = "api/user/onboarding")
@AllArgsConstructor
public class OnBoardingController {

    private OnboardingService onboardingService;
    private OnboardingRepository onboardingRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('HR', 'EMPLOYEE')")
    public ResponseEntity<?> saveOnboarding(
            @RequestBody OnboardingRequest request,
            @AuthenticationPrincipal User user) {
        onboardingService.saveOrUpdate(request, user.getId());

        OnBoarding onboarding = onboardingRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Onboarding not found"));

        return ResponseEntity.ok(new UserProfileDto(user, onboarding));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'EMPLOYEE')")
    public ResponseEntity<OnboardingResponse> getOnboarding(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(onboardingService.getByUserId(user.getId()));
    }

}
