package com.charllson.ems_backend.users;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @jakarta.persistence.Id
    @SequenceGenerator(name = "user_sequence", sequenceName = "user_sequence", allocationSize = 1)
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.SEQUENCE, generator = "user_sequence")
    private Long Id;
    private String name;
    @Column(unique = true)
    private String email;
    private String password;
    @Column(unique = true)
    private String phone;
    private String companyName;
    private String fullName;
    private String companySize;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    @Column(name = "terms_accepted")
    private Boolean termsAccepted;

    private Boolean locked;
    private Boolean enabled;
    private Boolean onboarding;

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
            Boolean enabled,
            Boolean onboarding) {
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
        this.onboarding = onboarding;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userRole.name());
        return Collections.singletonList(authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getRole() {
        return userRole.name();
    }

    public Long getId() {
        return Id;
    }

    public boolean getOboarding() {
        return onboarding;
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
