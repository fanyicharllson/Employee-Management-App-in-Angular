package com.charllson.ems_backend.respository;

import com.charllson.ems_backend.model.employee.Employee;
import com.charllson.ems_backend.users.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findByEmail(String email);
    List<Employee> findAllByAddedByUser(User user);

}
