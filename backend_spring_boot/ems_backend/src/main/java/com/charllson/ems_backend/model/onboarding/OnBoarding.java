package com.charllson.ems_backend.model.onboarding;

import java.time.LocalDateTime;
import java.util.List;

import com.charllson.ems_backend.users.User;
import com.charllson.ems_backend.users.UserRole;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "onboarding_data")
public class OnBoarding {
    @jakarta.persistence.Id
    @SequenceGenerator(name = "onboarding_sequence", sequenceName = "onboarding_sequence", allocationSize = 1)
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.SEQUENCE, generator = "onboarding_sequence")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String jobTitle;
    private String department;

    @Enumerated(EnumType.STRING)
    private UserRole roleType;

    private String teamSize;
    private Integer totalHires;
    private String salaryRange;
    private String experience;

    @ElementCollection
    private List<String> goals;

    private boolean notifications;
    private boolean onboarding;


    private LocalDateTime createdAt;

    public OnBoarding(User user, String jobTitle, String department, UserRole roleType, String teamSize,
            Integer totalHires, String salaryRange, String experience, List<String> goals, boolean notifications,
            LocalDateTime createdAt, boolean onboarding) {
        this.user = user;
        this.jobTitle = jobTitle;
        this.department = department;
        this.roleType = roleType;
        this.teamSize = teamSize;
        this.totalHires = totalHires;
        this.salaryRange = salaryRange;
        this.experience = experience;
        this.goals = goals;
        this.notifications = notifications;
        this.onboarding = onboarding;
        this.createdAt = createdAt;
        
    }

}
