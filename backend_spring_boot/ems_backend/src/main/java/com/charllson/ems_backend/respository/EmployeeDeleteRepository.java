package com.charllson.ems_backend.respository;

import com.charllson.ems_backend.model.employee.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeDeleteRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmailAndCompanyName(String email, String companyName);
}