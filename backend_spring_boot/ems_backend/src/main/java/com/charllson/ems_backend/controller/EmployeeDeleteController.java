package com.charllson.ems_backend.controller;

import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.helpers.DeleteEmployeeRequest;
import com.charllson.ems_backend.services.EmployeeDeleteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/employee")
@RequiredArgsConstructor
public class EmployeeDeleteController {

    private final EmployeeDeleteService employeeDeleteService;

    @DeleteMapping("/delete-employee")
    public ResponseEntity<ApiResponse> deleteEmployee(@RequestBody DeleteEmployeeRequest request) {
        
        try {
            ApiResponse response = employeeDeleteService.deleteEmployeeByEmailAndCompanyName(request.getEmail(), request.getCompanyName());
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An error occurred while deleting the employee: " + e.getMessage()));
        }
    }
}