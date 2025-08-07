package com.charllson.ems_backend.services;

import com.charllson.ems_backend.email.EmailHtml;
import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.AddEmployeeRequest;
import com.charllson.ems_backend.helpers.AddEmployeeResponse;
import com.charllson.ems_backend.model.employee.Employee;
import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import com.charllson.ems_backend.respository.EmployeeRepository;
import com.charllson.ems_backend.respository.UserRepository;
import com.charllson.ems_backend.users.User;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeInviteTokenService employeeInviteTokenService;
    private final EmailService emailService;
    private final EmailHtml emailHtml;
    private final UserRepository userRepository;
    @Value("${app.base-url:}")
    private String baseUrl;

    public AddEmployeeResponse addEmployee(AddEmployeeRequest request) {
        // Get the authenticated user (HR)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User hr = (User) authentication.getPrincipal();

        // Check if employee already exists
        Optional<Employee> existingEmployee = employeeRepository.findByEmail(request.getEmail());

        if (existingEmployee.isPresent()) {
            // Employee already exists, return appropriate response
            Employee employee = existingEmployee.get();
            return AddEmployeeResponse.builder()
                    .id(employee.getId().toString())
                    .HrId(employee.getAddedByUser().getId().toString())
                    .email(employee.getEmail())
                    .companyName(employee.getCompanyName())
                    .department(employee.getDepartment())
                    .fullName(employee.getFullName())
                    .role(employee.getRole())
                    .occupation(employee.getOccupation())
                    .message("Employee with this email already exists or is pending acceptance.")
                    .build();
        }

        // Create new employee
        Employee employee = new Employee(
                request.getFullName(),
                request.getEmail(),
                request.getOccupation(),
                request.getRole(),
                request.getDepartment(),
                request.getCompanyName(),
                hr
        );

        // Save employee to database
        Employee savedEmployee = employeeRepository.save(employee);

        //send invite email to employee
        String token = UUID.randomUUID().toString();

        EmployeeInviteToken employeeInviteToken = new EmployeeInviteToken(
                token,
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(3),
                employee,
                false,
                null,
                false
        );

        //Save the token
        employeeInviteTokenService.saveEmployeeInviteToken(employeeInviteToken);

        String emailLink = baseUrl + "/confirm-invite-email/token=" + token;

        String employeeInviteEmailHtml = emailHtml.buildAddEmployeeEmail(
                employee.getFullName(),
                employee.getEmail(),
                employee.getCompanyName(),
                employee.getDepartment(),
                employee.getOccupation(),
                hr.getFullName(),
                emailLink
        );

        emailService.sendEmail(employee.getEmail(), "[TeamNest] You have been Invited", employeeInviteEmailHtml);
        System.out.println("Employee invite email sent to " + employee.getEmail());
        // Return response
        return AddEmployeeResponse.builder()
                .id(savedEmployee.getId().toString())
                .HrId(hr.getId().toString())
                .email(savedEmployee.getEmail())
                .companyName(savedEmployee.getCompanyName())
                .department(savedEmployee.getDepartment())
                .fullName(savedEmployee.getFullName())
                .role(savedEmployee.getRole())
                .occupation(savedEmployee.getOccupation())
                .message("Employee added successfully.")
                .build();
    }

    public List<AddEmployeeResponse> getAllEmployeesByHrUser(User hrUser) {
        User hr = userRepository.findByEmail(hrUser.getEmail())
                .orElseThrow(() -> new BadRequestException("HR user not found in database"));

        List<Employee> employees = employeeRepository.findAllByAddedByUser(hr);

        return employees.stream()
                .map(employee -> mapToAddEmployeeResponse(employee, hr))
                .toList();
    }

    private AddEmployeeResponse mapToAddEmployeeResponse(Employee employee, User hr) {
        return AddEmployeeResponse.builder()
                .id(employee.getId().toString())
                .HrId(hr.getId().toString())
                .email(employee.getEmail())
                .companyName(employee.getCompanyName())
                .department(employee.getDepartment())
                .fullName(employee.getFullName())
                .role(employee.getRole())
                .occupation(employee.getOccupation())
                .message("Employee retrieved successfully.")
                .build();
    }

}
