package com.charllson.ems_backend.helpers;

import com.charllson.ems_backend.model.onboarding.OnBoarding;
import com.charllson.ems_backend.users.User;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class UserProfileDto {
    private Long id;
    private String email;
    private String companyName;
    private String companySize;
    private OnboardingDataDto profile;

    public UserProfileDto(User user, OnBoarding onboarding) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.companyName = user.getCompanyName();
        this.companySize = user.getCompanySize();

        if (onboarding != null) {
            this.profile = new OnboardingDataDto(onboarding);
        }
    }

}
