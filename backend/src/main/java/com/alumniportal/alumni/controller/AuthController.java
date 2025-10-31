package com.alumniportal.alumni.controller;

import com.alumniportal.alumni.dto.AuthRequest;
import com.alumniportal.alumni.dto.AuthResponse;
import com.alumniportal.alumni.dto.RegisterRequest;
import com.alumniportal.alumni.service.AuthService;
import com.alumniportal.alumni.service.CaptchaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final CaptchaService captchaService;

    public AuthController(AuthService authService, CaptchaService captchaService) {
        this.authService = authService;
        this.captchaService = captchaService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req, BindingResult result) {
        if (result.hasErrors()) {
            String errorMessage = result.getFieldErrors().stream()
                    .map(error -> error.getField() + ": " + error.getDefaultMessage())
                    .findFirst()
                    .orElse("Validation failed");
            return ResponseEntity.badRequest().body(errorMessage);
        }

        // Debug log: registration attempt
        System.out.println("=== REGISTER ATTEMPT ===");
        System.out.println("Email: " + req.getEmail());
        System.out.println("Role: " + req.getRole());
        System.out.println("Captcha token: " + req.getCaptcha());

        // Verify CAPTCHA
        boolean captchaValid = captchaService.verifyCaptcha(req.getCaptcha());
        System.out.println("Captcha valid? " + captchaValid);
        if (!captchaValid) {
            return ResponseEntity.badRequest().body("Captcha verification failed. Are you a robot?");
        }

        try {
            AuthResponse response = authService.register(req);
            System.out.println("Registration successful for email: " + req.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        // Debug log: login attempt
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + req.getEmail());
        System.out.println("Captcha token: " + req.getCaptcha());

        // Verify CAPTCHA
        boolean captchaValid = captchaService.verifyCaptcha(req.getCaptcha());
        System.out.println("Captcha valid? " + captchaValid);
        if (!captchaValid) {
            return ResponseEntity.badRequest().body("Captcha verification failed. Are you a robot?");
        }

        try {
            AuthResponse response = authService.login(req);
            System.out.println("Login successful for email: " + req.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
