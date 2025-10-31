package com.alumniportal.alumni.service;

import com.alumniportal.alumni.dto.AchievementRequest;
import com.alumniportal.alumni.entity.Achievement;
import com.alumniportal.alumni.exception.ResourceNotFoundException;
import com.alumniportal.alumni.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    // Add achievement (with optional file path)
    public Achievement addAchievement(AchievementRequest request, String imagePath) {
        System.out.println("🔐 Adding achievement for studentId: " + request.getStudentId());
        System.out.println("🔐 Title: " + request.getTitle());
        System.out.println("🔐 Description: " + request.getDescription());
        System.out.println("🔐 Image Path: " + imagePath);

        Achievement achievement = new Achievement(
                request.getStudentId(),
                request.getTitle(),
                request.getDescription(),
                imagePath
        );

        // ✅ Set studentEmail for querying
        achievement.setStudentEmail(request.getStudentId());

        Achievement saved = achievementRepository.save(achievement);
        System.out.println("✅ Achievement saved with ID: " + saved.getId());
        return saved;
    }

    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    public List<Achievement> getAchievementsByStudent(String studentId) {
        List<Achievement> list = achievementRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
        if (list.isEmpty()) {
            throw new ResourceNotFoundException("No achievements found for student ID: " + studentId);
        }
        return list;
    }

    // ✅ Method: fetch by student email
    public List<Achievement> getAchievementsByEmail(String email) {
        System.out.println("🔐 Searching achievements for email: " + email);
        List<Achievement> list = achievementRepository.findByStudentEmailOrderByCreatedAtDesc(email);
        System.out.println("🔐 Found " + list.size() + " achievements for email: " + email);
        return list;
    }
}