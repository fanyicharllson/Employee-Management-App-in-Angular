package com.charllson.ems_backend.helpers;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class UserRegistrationRequest {
    private final String companyName;
    private final String fullName;
    private final String email;
    private final String password;
    private final String companySize;
    private final Boolean hasAcceptTerms;

    
}
