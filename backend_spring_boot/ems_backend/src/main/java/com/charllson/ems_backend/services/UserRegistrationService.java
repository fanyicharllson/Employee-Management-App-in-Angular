package com.charllson.ems_backend.services;

import org.springframework.stereotype.Service;

import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.EmailValidaor;
import com.charllson.ems_backend.helpers.UserRegistrationRequest;
import com.charllson.ems_backend.model.token.ConfirmationToken;
import com.charllson.ems_backend.users.User;
import com.charllson.ems_backend.users.UserRole;

import jakarta.transaction.Transactional;

@Service
public class UserRegistrationService {

    private final EmailValidaor emailValidaor;
    private final UserService userService;
    private final ConfirmationTokenService confirmationTokenService;

    // Constructor injection
    public UserRegistrationService(EmailValidaor emailValidaor, UserService userService, ConfirmationTokenService confirmationTokenService) {
        this.confirmationTokenService = confirmationTokenService;
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
                        false 
                ));
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService.getToken(token).orElseThrow(() -> new BadRequestException("Invalid token. Please request a new one."));

        if(confirmationToken.getConfirmedAt() != null) {
            throw new BadRequestException("Email already confirmed. Please log in.");
        }

        if (confirmationToken.getExpiredAt().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Expired token. Please request a new one.");
        }

        confirmationToken.setConfirmedAt(java.time.LocalDateTime.now());
        confirmationTokenService.saveConfirmationToken(confirmationToken);
        userService.enableUser(confirmationToken.getUser().getEmail());
        return "Confirmed";
    }



}
