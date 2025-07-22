package com.charllson.ems_backend.services;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.charllson.ems_backend.email.EmailHtml;
import com.charllson.ems_backend.email.EmailSender;
import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.model.token.ConfirmationToken;
import com.charllson.ems_backend.respository.UserRepository;
import com.charllson.ems_backend.users.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    @Value("${app.base-url:}")
    private String baseUrl;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmailSender emailSender;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailHtml emailHtml;
    private final static String USER_NOT_FOUND_MSG = "user with this email %s not found";
    private final JwtService jwtService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND_MSG, email)));
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // SignUp User
    public ApiResponse signUpUser(User user) {
        boolean userExists = userRepository.findByEmail(user.getEmail()).isPresent();
        if (userExists) {
            throw new BadRequestException("Email already exists. Please use a different email.");
        }
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);

        String token = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                user,
                null);

        confirmationTokenService.saveConfirmationToken(confirmationToken);

        String emailLink = baseUrl + "/confirm-email/token=" + token;
        // Send email
        emailSender.send(user.getEmail(), emailHtml.buildEmailHtml(user.getFullName(), emailLink));

        return new ApiResponse(true, "Registered successfully! Redirecting...",
                token);
    }

    public void enableUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found! Please sign up to continue 🤗."));
        user.setEnabled(true);
        userRepository.save(user);
    }

    // This method is called in your /login endpoint
    public String authenticateAndGenerateToken(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid credentials! Please try again."));

        if (!bCryptPasswordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadRequestException("Invalid credentials! Please try again.");
        }

        // Use email or ID or both in JWT claims
        return jwtService.generateToken(user);
    }

}
