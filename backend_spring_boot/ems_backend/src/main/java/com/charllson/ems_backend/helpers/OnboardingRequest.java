package com.charllson.ems_backend.helpers;

import java.util.List;

import com.charllson.ems_backend.users.UserRole;

public record OnboardingRequest(
        String jobTitle,
        String department,
        UserRole roleType,
        String teamSize,
        Integer totalHires,
        String salaryRange,
        String experience,
        List<String> goals,
        boolean notifications,
        boolean onboarding) {
}
