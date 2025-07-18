package com.charllson.ems_backend.services;

import org.springframework.stereotype.Service;

import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.EmailValidaor;
import com.charllson.ems_backend.helpers.UserRegistrationRequest;
import com.charllson.ems_backend.users.User;
import com.charllson.ems_backend.users.UserRole;

@Service
public class UserRegistrationService {

    private final EmailValidaor emailValidaor;
    private final UserService userService;

    // Constructor injection
    public UserRegistrationService(EmailValidaor emailValidaor, UserService userService) {
        this.emailValidaor = emailValidaor;
        this.userService = userService;
    }

    public String register(UserRegistrationRequest userRegistrationRequest) {
        boolean isValidEmail = emailValidaor.test(userRegistrationRequest.getEmail());
        if (!isValidEmail) {
            throw new BadRequestException("Invalid email address.");
        }
        return userService.signUpUser(
                new User(
                        userRegistrationRequest.getFullName(), 
                        userRegistrationRequest.getFullName(), 
                        userRegistrationRequest.getEmail(), 
                        userRegistrationRequest.getPassword(),
                        null,
                        userRegistrationRequest.getCompanyName(), 
                        userRegistrationRequest.getCompanySize(), 
                        UserRole.HR,
                        userRegistrationRequest.getHasAcceptTerms(),
                        false, 
                        true 
                ));
    }

}
