package com.charllson.ems_backend.services;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.charllson.ems_backend.model.token.ConfirmationToken;
import com.charllson.ems_backend.respository.ConfirmationTokenRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ConfirmationTokenService {
    private final ConfirmationTokenRepository confirmationTokenRepository;


    public void saveConfirmationToken(ConfirmationToken token) {
        confirmationTokenRepository.save(token);
    }

    public Optional<ConfirmationToken> getToken(String token) {
        return confirmationTokenRepository.findByToken(token);
    }

    
}
