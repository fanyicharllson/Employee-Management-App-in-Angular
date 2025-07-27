package com.charllson.ems_backend.helpers;

import com.charllson.ems_backend.users.UserRole;

import java.time.LocalDateTime;
import java.util.List;


public record OnboardingResponse(
        String jobTitle,
        String department,
        UserRole roleType,
        String teamSize,
        Integer totalHires,
        String salaryRange,
        String experience,
        List<String> goals,
        boolean notifications,
        boolean onboarding,
        LocalDateTime createdAt
        ) {
}
