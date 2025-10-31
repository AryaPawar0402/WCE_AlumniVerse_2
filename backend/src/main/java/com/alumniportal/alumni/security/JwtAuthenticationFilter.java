package com.alumniportal.alumni.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // ✅ ONLY skip endpoints that truly don't need authentication
        return path.startsWith("/api/auth/") ||
                path.startsWith("/h2-console") ||
                path.startsWith("/actuator") ||
                path.startsWith("/api/images");
        // REMOVED: achievements from skip list - they need authentication
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        String contentType = request.getContentType();
        boolean isMultipart = contentType != null && contentType.startsWith("multipart/form-data");

        System.out.println("=== JWT FILTER START ===");
        System.out.println("Request URI: " + request.getRequestURI());
        System.out.println("Content-Type: " + contentType);
        System.out.println("Is Multipart: " + isMultipart);
        System.out.println("Authorization header: " + header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("Token received: " + token);

            try {
                if (jwtUtil.validateToken(token)) {
                    System.out.println("✅ Token is valid");
                    String email = jwtUtil.getEmailFromToken(token);
                    String role = jwtUtil.getRoleFromToken(token);

                    System.out.println("JWT Filter - Email: " + email);
                    System.out.println("JWT Filter - Role from token: " + role);

                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        System.out.println("Loading user details for: " + email);
                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                        String authority;
                        if (role != null && !role.startsWith("ROLE_")) {
                            authority = "ROLE_" + role;
                        } else {
                            authority = role;
                        }

                        System.out.println("JWT Filter - Final authority: " + authority);

                        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authority));

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                        SecurityContextHolder.getContext().setAuthentication(auth);

                        System.out.println("✅ JWT Filter - Authentication set successfully for: " + email);
                    } else {
                        System.out.println("❌ Email is null or authentication already exists");
                    }
                } else {
                    System.out.println("❌ Token validation failed");
                    System.out.println("⚠️ Continuing request without authentication");
                }
            } catch (Exception e) {
                System.out.println("❌ JWT Filter - Exception: " + e.getMessage());
                e.printStackTrace();
                System.out.println("⚠️ Continuing request despite JWT exception");
            }
        } else {
            System.out.println("❌ No Bearer token found");
            // For achievement endpoints, we need authentication
            if (request.getRequestURI().startsWith("/api/achievements/")) {
                System.out.println("⚠️ Achievement endpoint requires auth but no token provided");
            }
        }

        System.out.println("=== JWT FILTER END ===");
        filterChain.doFilter(request, response);
    }
}