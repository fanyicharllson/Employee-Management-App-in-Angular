package com.charllson.ems_backend.services;

import com.charllson.ems_backend.email.EmailHtml;
import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.EmailValidaor;
import com.charllson.ems_backend.helpers.UserRegistrationRequest;
import com.charllson.ems_backend.model.token.ConfirmationToken;
import com.charllson.ems_backend.respository.UserRepository;
import com.charllson.ems_backend.users.User;
import com.charllson.ems_backend.users.UserRole;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class HrRegistrationService {

    private final EmailService emailService;
    private final EmailValidaor emailValidaor;
    private final UserService userService;
    private final ConfirmationTokenService confirmationTokenService;
    private final UserRepository userRepository;
    private final EmailHtml emailHtml;
    @Value("${app.base-url:}")
    private String baseUrl;

    // Constructor injection
    public HrRegistrationService(
            EmailValidaor emailValidaor,
            UserService userService,
            ConfirmationTokenService confirmationTokenService,
            UserRepository userRepository,
            EmailHtml emailHtml,
            EmailService emailService
    ) {
        this.confirmationTokenService = confirmationTokenService;
        this.emailValidaor = emailValidaor;
        this.userService = userService;
        this.userRepository = userRepository;
        this.emailHtml = emailHtml;
        this.emailService = emailService;
    }

    @PostConstruct
    private void validateBaseUrl() {
        if (baseUrl == null || baseUrl.isBlank()) {
            System.out.println("Missing app.base-url config! " + baseUrl);
            throw new IllegalStateException("Missing app.base-url config!");
        }
    }

    public ApiResponse register(UserRegistrationRequest userRegistrationRequest) {
        boolean isValidEmail = emailValidaor.test(userRegistrationRequest.getEmail());
        if (!isValidEmail) {
            throw new BadRequestException("Invalid email address.");
        }
        if (userRegistrationRequest.getHasAcceptTerms() == null || !userRegistrationRequest.getHasAcceptTerms()) {
            throw new BadRequestException("You must accept the terms to register.");
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
                        false,
                        true
                ));
    }

    @Transactional
    public ApiResponse confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService.getToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid token. Please request a new one."));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new BadRequestException("Email already confirmed. Please log in.");
        }

        if (confirmationToken.getExpiredAt().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Expired token. Please request a new one.");
        }

        confirmationToken.setConfirmedAt(java.time.LocalDateTime.now());
        confirmationTokenService.saveConfirmationToken(confirmationToken);
        userService.enableUser(confirmationToken.getUser().getEmail());

        return new ApiResponse(true, "Email confirmed successfully");
    }

    @Transactional
    public ApiResponse resendConfirmationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found! Please sign up to continue 🤗."));

        if (user.isEnabled()) {
            throw new BadRequestException("Account already verified. Please log in.", "ACCOUNT_ALREADY_VERIFIED");
        }

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                user,
                null);

        confirmationTokenService.saveConfirmationToken(confirmationToken);

        String emailLink = baseUrl + "/confirm-email/token=" + token;
        String verificationHtml = emailHtml.buildVerificationEmail(user.getFullName(), emailLink);
        emailService.sendEmail(user.getEmail(), "[TeamNest] Verify Your TeamNest Account", verificationHtml);

        return new ApiResponse(true, "Verification email resent successfully! Please check your inbox.", token);
    }

}
