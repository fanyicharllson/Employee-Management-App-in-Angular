package com.charllson.ems_backend.services;

import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import com.charllson.ems_backend.respository.EmployeeInviteTokenRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class EmployeeInviteTokenService {

    private final EmployeeInviteTokenRepository employeeInviteTokenRepository;

    public void saveEmployeeInviteToken(EmployeeInviteToken token) {
        employeeInviteTokenRepository.save(token);
    }

    public Optional<EmployeeInviteToken> getToken(String token) {
        return employeeInviteTokenRepository.findByToken(token);
    }
}
