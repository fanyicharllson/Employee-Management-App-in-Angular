package com.charllson.ems_backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.charllson.ems_backend.helpers.UserRegistrationRequest;
import com.charllson.ems_backend.services.UserRegistrationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping(path = "api/v1/user-registration")
@AllArgsConstructor
public class UserRegistrationController {

    private UserRegistrationService userRegistrationService;

    @PostMapping
    public String register(@RequestBody UserRegistrationRequest userRegistrationRequest) {
        return userRegistrationService.register(userRegistrationRequest);
    }
    
}
