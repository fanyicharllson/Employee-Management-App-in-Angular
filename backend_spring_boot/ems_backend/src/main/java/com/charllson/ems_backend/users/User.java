package com.charllson.ems_backend.users;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.SequenceGenerator;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
public class User implements UserDetails {

    @jakarta.persistence.Id
    @SequenceGenerator(
        name = "user_sequence",
        sequenceName = "user_sequence",
        allocationSize = 1
    )
    @GeneratedValue(
        strategy = jakarta.persistence.GenerationType.SEQUENCE,
        generator = "user_sequence"
    )
    private Long Id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String companyName;
    private String fullName;
    private String companySize;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    private Boolean termsAccepted;
    private Boolean locked;
    private Boolean enabled;

    public User(String name, 
                String fullName, 
                String email, 
                String password, 
                String phone, 
                String companyName,
                String companySize, 
                UserRole userRole, 
                Boolean termsAccepted, 
                Boolean locked, 
                Boolean enabled) {
        this.phone = phone;
        this.companyName = companyName;
        this.companySize = companySize;
        this.userRole = userRole;
        this.termsAccepted = termsAccepted;
        this.locked = locked;
        this.enabled = enabled;
        this.email = email;
        this.password = password;
        this.name = name;
        this.fullName = fullName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(userRole.name());
        return Collections.singletonList(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return fullName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

}
