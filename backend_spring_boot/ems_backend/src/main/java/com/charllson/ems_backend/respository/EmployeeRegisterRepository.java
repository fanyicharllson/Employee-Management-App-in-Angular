package com.charllson.ems_backend.respository;

import com.charllson.ems_backend.model.employee.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRegisterRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findById(Long Long);
    Optional<Employee> findByEmail(String email);
}
