package com.charllson.ems_backend.helpers;

import java.util.List;

import com.charllson.ems_backend.model.onboarding.OnBoarding;
import com.charllson.ems_backend.users.UserRole;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class OnboardingDataDto {

    private String jobTitle;
    private String department;
    private UserRole roleType;
    private String teamSize;
    private int totalHires;
    private String salaryRange;
    private String experience;
    private List<String> goals;
    private boolean notifications;
    private boolean onboarding;

    public OnboardingDataDto(OnBoarding onboarding) {
        this.jobTitle = onboarding.getJobTitle();
        this.department = onboarding.getDepartment();
        this.roleType = onboarding.getRoleType();
        this.teamSize = onboarding.getTeamSize();
        this.totalHires = onboarding.getTotalHires();
        this.salaryRange = onboarding.getSalaryRange();
        this.experience = onboarding.getExperience();
        this.goals = onboarding.getGoals();
        this.notifications = onboarding.isNotifications();
        this.onboarding = onboarding.isOnboarding();

    }

}
