package com.charllson.ems_backend.helpers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddEmployeeResponse {
    private String id;
    private String HrId; //Hr who added the employee
    private String email;
    private String companyName;
    private String department;
    private String fullName;
    private String role;
    private String occupation;
    private String message;
}
