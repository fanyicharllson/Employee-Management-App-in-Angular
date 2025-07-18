package com.charllson.ems_backend.services;

import org.springframework.stereotype.Service;

import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.EmailValidaor;
import com.charllson.ems_backend.helpers.UserRegistrationRequest;

@Service
public class UserRegistrationService {

    private EmailValidaor emailValidaor;

    public String register(UserRegistrationRequest userRegistrationRequest) {
        boolean isValidEmail = emailValidaor.test(userRegistrationRequest.getEmail());
        if (!isValidEmail) {
            throw new BadRequestException("Invalid email address.");
        }
        return "works";
    }

}
