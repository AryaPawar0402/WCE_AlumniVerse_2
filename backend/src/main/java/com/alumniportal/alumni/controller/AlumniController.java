package com.alumniportal.alumni.controller;

import com.alumniportal.alumni.dto.ProfileDTO;
import com.alumniportal.alumni.entity.Job;
import com.alumniportal.alumni.entity.User;
import com.alumniportal.alumni.repository.JobRepository;
import com.alumniportal.alumni.repository.UserRepository;
import com.alumniportal.alumni.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AlumniController {

    private final ProfileService profileService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public AlumniController(ProfileService profileService,
                            UserRepository userRepository,
                            JobRepository jobRepository) {
        this.profileService = profileService;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    /**
     * Get logged-in alumni profile
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<ProfileDTO> getAlumniProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String email = principal.getName();
        ProfileDTO profile = profileService.getProfileByEmail(email);

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile);
    }

    /**
     * Get jobs posted by this alumni
     */
    @GetMapping("/jobs")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<List<Job>> getAlumniJobs(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String email = principal.getName();
        User alumni = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));

        List<Job> jobs = jobRepository.findByPostedBy(alumni);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Post a new job
     */
    @PostMapping("/jobs")
    @PreAuthorize("hasRole('ALUMNI')")
    public ResponseEntity<Job> postJob(@RequestBody Job jobRequest, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String email = principal.getName();
        User alumni = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Alumni not found"));

        jobRequest.setPostedBy(alumni);
        Job savedJob = jobRepository.save(jobRequest);

        return ResponseEntity.ok(savedJob);
    }
}
