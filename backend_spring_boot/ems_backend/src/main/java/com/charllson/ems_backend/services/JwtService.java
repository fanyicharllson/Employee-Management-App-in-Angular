package com.charllson.ems_backend.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

import com.charllson.ems_backend.users.User;

@Service
public class JwtService {

    private final String secretString = "dfhdhgjdvkjxc*&^%$ER$#@!GjJLLBGFTERCDXVBNMddddsiuw"; 
    private final SecretKey secretKey = Keys.hmacShaKeyFor(secretString.getBytes());
    // private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getEmail()) 
                .claim("role", user.getRole())
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plus(1, ChronoUnit.DAYS))) 
                .signWith(secretKey) 
                .compact();
    }

    /**
     * Validate a JWT token. This method verifies the token's signature and ensures it hasn't expired.
     * @param token the JWT token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey) 
                    .build()
                    .parseSignedClaims(token); 
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey) 
                .build()
                .parseSignedClaims(token) 
                .getPayload()
                .getSubject();
    }

    // Additional method to extract user role from token
    public String extractRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    // Method to check if token is expired
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}