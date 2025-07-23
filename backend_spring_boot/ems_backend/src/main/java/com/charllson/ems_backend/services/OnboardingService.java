package com.charllson.ems_backend.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.OnboardingRequest;
import com.charllson.ems_backend.helpers.OnboardingResponse;
import com.charllson.ems_backend.model.onboarding.OnBoarding;
import com.charllson.ems_backend.respository.OnboardingRepository;
import com.charllson.ems_backend.respository.UserRepository;
import com.charllson.ems_backend.users.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final OnboardingRepository onboardingRepository;
    private final UserRepository userRepository;

    public void saveOrUpdate(OnboardingRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Optional<OnBoarding> existing = onboardingRepository.findByUserId(userId);

        OnBoarding oBoarding = existing.orElseGet(() -> new OnBoarding());
        oBoarding.setUser(user);
        oBoarding.setJobTitle(request.jobTitle());
        oBoarding.setDepartment(request.department());
        oBoarding.setRoleType(request.roleType());
        oBoarding.setTeamSize(request.teamSize());
        oBoarding.setTotalHires(request.totalHires());
        oBoarding.setSalaryRange(request.salaryRange());
        oBoarding.setExperience(request.experience());
        oBoarding.setGoals(request.goals());
        oBoarding.setNotifications(request.notifications());
        oBoarding.setOnboarding(request.onboarding());
        oBoarding.setCreatedAt(LocalDateTime.now());;

        onboardingRepository.save(oBoarding);
        user.setOnboarding(request.onboarding()); // Update user's onboarding status to false
        userRepository.save(user);
    }

    public OnboardingResponse getByUserId(Long userId) {
        OnBoarding oBoarding = onboardingRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Onboarding data not found!"));

        return new OnboardingResponse(
                oBoarding.getJobTitle(),
                oBoarding.getDepartment(),
                oBoarding.getRoleType(),
                oBoarding.getTeamSize(),
                oBoarding.getTotalHires(),
                oBoarding.getSalaryRange(),
                oBoarding.getExperience(),
                oBoarding.getGoals(),
                oBoarding.isNotifications(),
                oBoarding.isOnboarding());
    }
}
