package com.charllson.ems_backend.services;

import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.model.employee.Employee;
import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import com.charllson.ems_backend.respository.EmployeeDeleteRepository;
import com.charllson.ems_backend.respository.EmployeeInviteTokenRepository;
import com.charllson.ems_backend.respository.UserRepository;
import com.charllson.ems_backend.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeDeleteService {

    private final EmployeeDeleteRepository employeeDeleteRepository;
    private final EmployeeInviteTokenRepository employeeInviteTokenRepository;
    private final UserRepository userRepository;

    @Transactional
    public ApiResponse deleteEmployeeByEmailAndCompanyName(String email, String companyName) {
        // Find the employee by email and company name
        Optional<Employee> employeeOptional = employeeDeleteRepository.findByEmailAndCompanyName(email, companyName);

        if (employeeOptional.isEmpty()) {
            return new ApiResponse(false, "Employee not found with the provided email and company name");
        }

        Employee employee = employeeOptional.get();


        // Delete ALL associated invite tokens for this employee
        List<EmployeeInviteToken> tokens = employeeInviteTokenRepository.findAllByEmployeeId(employee.getId());
        if (!tokens.isEmpty()) {
            employeeInviteTokenRepository.deleteAll(tokens);
        }

        // Check if employee has an associated user account and delete it
        User user = employee.getUser();
        if (user != null) {
            // Remove the reference to avoid constraint violations
            employee.setUser(null);
            employeeDeleteRepository.save(employee);

            // Delete the user
            userRepository.delete(user);
        }

        // Finally delete the employee
        employeeDeleteRepository.delete(employee);

        return new ApiResponse(true, "Employee deleted successfully");
    }
}