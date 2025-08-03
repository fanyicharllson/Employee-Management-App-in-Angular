package com.charllson.ems_backend.respository;

import com.charllson.ems_backend.model.token.EmployeeInviteToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeeInviteTokenRepository extends JpaRepository<EmployeeInviteToken, Long> {
    Optional<EmployeeInviteToken> findByToken(String token);
}
