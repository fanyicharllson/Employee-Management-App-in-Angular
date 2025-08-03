package com.charllson.ems_backend.controller;

import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.AddEmployeeRequest;
import com.charllson.ems_backend.helpers.AddEmployeeResponse;
import com.charllson.ems_backend.services.EmployeeService;
import com.charllson.ems_backend.users.User;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/employee")
@AllArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping("/add-employee")
    public ResponseEntity<AddEmployeeResponse> addEmployee(@RequestBody AddEmployeeRequest request) {
        AddEmployeeResponse response = employeeService.addEmployee(request);

        // If the employee already exists, return a conflict status
        if (response.getMessage().contains("already exists")) {
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        // Otherwise, return a created status
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get-all-employee")
    public ResponseEntity<?> getEmployees(@AuthenticationPrincipal User user) {
        if (user == null || user.getEmail() == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized: User not authenticated"));
        }

        try {
            List<AddEmployeeResponse> employees = employeeService.getAllEmployeesByHrUser(user);

            if (employees.isEmpty()) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "No employees found for this HR"));
            }

            return ResponseEntity.ok(employees);
        } catch (BadRequestException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Internal server error occurred"));
        }
    }

}
