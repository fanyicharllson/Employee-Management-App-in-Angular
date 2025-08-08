package com.charllson.ems_backend.helpers;

import com.charllson.ems_backend.services.JwtService;
import com.charllson.ems_backend.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@AllArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    private static final List<String> PERMITTED_PATTERNS = Arrays.asList(
            "/api/v*/user-registration/**",
            "/api/auth/**",
            "/api/employee/confirm-invite-token",
            "/api/employee/token-hasAccount-used",
            "/api/employee/employee-login/**"
    );

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String requestPath = request.getRequestURI();

        // Allow unauthenticated access to permitted endpoints
        if (isPermittedPath(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get JWT from Authorization header or cookie
        final String authHeader = request.getHeader("Authorization");
        final String jwtFromCookie = getJwtFromCookie(request);

        String jwt = null;
        String userEmail = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        } else if (jwtFromCookie != null) {
            jwt = jwtFromCookie;
        }

        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPermittedPath(String requestPath) {
        return PERMITTED_PATTERNS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, requestPath));
    }

    private String getJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
