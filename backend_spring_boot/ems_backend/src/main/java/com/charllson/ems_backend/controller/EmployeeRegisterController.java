package com.charllson.ems_backend.controller;

import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.helpers.EmployeeRegisterRequest;
import com.charllson.ems_backend.services.EmployeeRegisterService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/auth/employee/")
@AllArgsConstructor
public class EmployeeRegisterController {

    private EmployeeRegisterService employeeRegisterService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody EmployeeRegisterRequest employeeRegisterRequest) {
        ApiResponse response = employeeRegisterService.register(employeeRegisterRequest);
        return ResponseEntity.ok(response);
    }
}
