package com.charllson.ems_backend.model.token;

import com.charllson.ems_backend.model.employee.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "employee_invitation_tokens")
public class EmployeeInviteToken {

    @jakarta.persistence.Id
    @SequenceGenerator(
            name = "employee_token_sequence",
            sequenceName = "employee_token_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = jakarta.persistence.GenerationType.SEQUENCE,
            generator = "employee_token_sequence"
    )
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime created_at;

    @Column(nullable = false, name = "expired_at")
    private LocalDateTime expired_at;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "employee_id"
    )
    private Employee employee;

    private Boolean used;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmed_at;


    public EmployeeInviteToken(String token, LocalDateTime createdAt, LocalDateTime expiredAt, Employee
            employee, Boolean used, LocalDateTime confirmed_at) {
        this.token = token;
        this.created_at = createdAt;
        this.expired_at = expiredAt;
        this.employee = employee;
        this.confirmed_at = confirmed_at;
        this.used = used;

    }
}
