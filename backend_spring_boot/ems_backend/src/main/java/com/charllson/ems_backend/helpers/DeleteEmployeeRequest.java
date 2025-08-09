package com.charllson.ems_backend.helpers;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class DeleteEmployeeRequest {
    private String email;
    private String companyName;
}
