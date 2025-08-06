package com.charllson.ems_backend.controller;

import com.charllson.ems_backend.exceptions.ApiResponse;
import com.charllson.ems_backend.exceptions.BadRequestException;
import com.charllson.ems_backend.helpers.AddEmployeeRequest;
import com.charllson.ems_backend.helpers.AddEmployeeResponse;
import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import com.charllson.ems_backend.services.EmployeeInviteTokenService;
import com.charllson.ems_backend.services.EmployeeService;
import com.charllson.ems_backend.users.User;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/employee")
@AllArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeInviteTokenService employeeInviteTokenService;

    @PostMapping("/add-employee")
    public ResponseEntity<AddEmployeeResponse> addEmployee(@RequestBody AddEmployeeRequest request) {
        AddEmployeeResponse response = employeeService.addEmployee(request);

        if (response.getMessage().contains("already exists")) {
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
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

    @GetMapping(path = "/confirm-invite-token")
    public ResponseEntity<ApiResponse> confirmToken(@RequestParam("token") String token) {
        try {
            // Get the token from the repository
            EmployeeInviteToken employeeInviteToken = employeeInviteTokenService.getToken(token)
                    .orElseThrow(() -> new BadRequestException("Invalid token. Please request a new one."));
            
            // Check if the token has already been confirmed
            if (employeeInviteToken.getConfirmed_at() != null) {
                return ResponseEntity.ok(new ApiResponse(false, "Invitation already confirmed!."));
            }
            
            // Check if the token has been used
            if (Boolean.TRUE.equals(employeeInviteToken.getUsed())) {
                return ResponseEntity.ok(new ApiResponse(false, "Invitation already used."));
            }
            
            // Check if the token has expired (7 days)
            LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
            if (employeeInviteToken.getCreated_at().isBefore(sevenDaysAgo)) {
                return ResponseEntity.ok(new ApiResponse(false, "Invitation token has expired (older than 7 days). Please contact your HR."));
            }
            
            // Mark the token as confirmed
            employeeInviteToken.setConfirmed_at(LocalDateTime.now());
            employeeInviteToken.setUsed(true);
            employeeInviteTokenService.saveEmployeeInviteToken(employeeInviteToken);

            String employeeEmail = employeeInviteToken.getEmployee().getEmail();
            String companyName = employeeInviteToken.getEmployee().getCompanyName();
//            String tokeN = employeeInviteToken.getToken();


            return ResponseEntity.ok(new ApiResponse(true, "You have been verified successfully by TeamNest! You will be redirected to complete account setup in a few seconds...", employeeEmail, companyName));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An error occurred while confirming the invitation."));
        }
    }



//    @GetMapping("/token-used")
//    public ResponseEntity<ApiResponse> getTokenUsed() {
//
//    }



}
