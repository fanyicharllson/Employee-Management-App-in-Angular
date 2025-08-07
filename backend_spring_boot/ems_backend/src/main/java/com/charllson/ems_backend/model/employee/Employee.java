package com.charllson.ems_backend.model.employee;

import com.charllson.ems_backend.users.User;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @SequenceGenerator(name = "employee_sequence", sequenceName = "employee_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_sequence")
    private Long id;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String occupation;
    
    private String role;
    
    private String department;
    
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_user_id", nullable = false)
    private User addedByUser;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    public Employee(String fullName, String email, String occupation, String role, 
                   String department, String companyName, User addedByUser) {
        this.fullName = fullName;
        this.email = email;
        this.occupation = occupation;
        this.role = role;
        this.department = department;
        this.companyName = companyName;
        this.addedByUser = addedByUser;
        this.createdAt = LocalDateTime.now();
    }
}
