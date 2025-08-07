package com.charllson.ems_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.helpers.UserRegistrationRequest;
import com.charllson.ems_backend.services.HrRegistrationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping(path = "api/v1/user-registration")
@AllArgsConstructor
public class HrRegistrationController {

    private HrRegistrationService userRegistrationService;

    @PostMapping
    public ResponseEntity<ApiResponse> register(@RequestBody UserRegistrationRequest userRegistrationRequest) {
        ApiResponse response = userRegistrationService.register(userRegistrationRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "confirm-token")
    public ResponseEntity<ApiResponse> confirmToken(@RequestParam("token") String token) {
        ApiResponse response = userRegistrationService.confirmToken(token);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "resend-token")
    public ResponseEntity<ApiResponse> resendToken(@RequestParam("email") String email) {
        ApiResponse response = userRegistrationService.resendConfirmationEmail(email);
        return ResponseEntity.ok(response);
    }

}
