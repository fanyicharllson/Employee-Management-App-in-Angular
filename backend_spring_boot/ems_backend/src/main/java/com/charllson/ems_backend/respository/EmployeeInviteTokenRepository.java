package com.charllson.ems_backend.respository;

import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface EmployeeInviteTokenRepository extends JpaRepository<EmployeeInviteToken, Long> {
    Optional<EmployeeInviteToken> findByToken(String token);
    
    @Query("SELECT t FROM EmployeeInviteToken t WHERE t.employee.email = :email AND t.hasAccount = false ORDER BY t.created_at DESC")
    Optional<EmployeeInviteToken> findLatestByEmployeeEmail(@Param("email") String email);
}
