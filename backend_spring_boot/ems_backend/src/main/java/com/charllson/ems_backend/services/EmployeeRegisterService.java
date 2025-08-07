package com.charllson.ems_backend.services;

import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.EmailValidaor;
import com.charllson.ems_backend.helpers.EmployeeRegisterRequest;
import com.charllson.ems_backend.model.employee.Employee;
import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import com.charllson.ems_backend.respository.EmployeeInviteTokenRepository;
import com.charllson.ems_backend.respository.EmployeeRegisterRepository;
import com.charllson.ems_backend.respository.EmployeeRepository;
import com.charllson.ems_backend.respository.UserRepository;
import com.charllson.ems_backend.users.User;
import com.charllson.ems_backend.users.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeRegisterService {

    private final EmailValidaor emailValidaor;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmployeeRegisterRepository employeeRegisterRepository;
    private final EmployeeInviteTokenRepository employeeInviteTokenRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public ApiResponse register(EmployeeRegisterRequest employeeRegisterRequest) {
        boolean isValidEmail = emailValidaor.test(employeeRegisterRequest.getEmail());
        //Ensure its a valid email
        if (!isValidEmail) {
            throw new BadRequestException("Invalid email address. Please use a valid email address.");
        }

        //Check if there already an existing user
        boolean userExists = userRepository.findByEmail(employeeRegisterRequest.getEmail()).isPresent();
//        boolean employeeExists = employeeRepository.findByEmail(employeeRegisterRequest.getEmail()).isPresent();
        if (userExists) {
            throw new BadRequestException("Email already exists. Please use a different email.");
        }

        // Find the invitation token using employee email
        Optional<EmployeeInviteToken> tokenOptional = employeeInviteTokenRepository.findLatestByEmployeeEmail(employeeRegisterRequest.getEmail());
        if (tokenOptional.isEmpty()) {
            // Check if the employee exists but has no token
            Optional<Employee> employeeOptional = employeeRepository.findByEmail(employeeRegisterRequest.getEmail());
            if (employeeOptional.isPresent()) {
                throw new BadRequestException("Your invitation has expired or is invalid. Please contact your administrator for a new invitation.");
            } else {
                throw new BadRequestException("No invitation found for this email. Please contact your administrator.");
            }
        }

        EmployeeInviteToken inviteToken = tokenOptional.get();
        Employee employee = inviteToken.getEmployee();

        // Verify that the email matches the invited employee's email
        if (!employee.getEmail().equals(employeeRegisterRequest.getEmail())) {
            throw new BadRequestException("Email does not match the invited employee's email.");
        }
        
        // Check if token is expired
        if (inviteToken.getExpired_at().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Your invitation has expired. Please contact your administrator for a new invitation.");
        }
        
        // Check if token is not already used
        if (Boolean.FALSE.equals(inviteToken.getUsed())) {
            throw new BadRequestException("Please use the link in the invitation email to register your account. If you have already used the link, please contact your administrator for a new invitation.");
        }

        //hash password
        String encodedPassword = bCryptPasswordEncoder.encode(employeeRegisterRequest.getPassword());

        // Create and save the User entity
        User user = new User(
                employee.getFullName(), // name
                employee.getFullName(), // fullName
                employee.getEmail(), // email
                encodedPassword, // password
                null, // phone
                employee.getCompanyName(), // companyName
                employee.getAddedByUser().getCompanySize(), // companySize
                UserRole.EMPLOYEE, // userRole
                true, // termsAccepted
                false, // locked
                true, // enabled
                true // onboarding
        );
        
        userRepository.save(user);
        
        // Update the Employee entity with user information
        employee.setUser(user);
        employeeRepository.save(employee);

        // Update token status
        inviteToken.setHasAccount(true);
        inviteToken.setUsed(true);
        inviteToken.setConfirmed_at(java.time.LocalDateTime.now());
        employeeInviteTokenRepository.save(inviteToken);

        return new ApiResponse(true, "Registration successful! You can now login...");
    }
}
