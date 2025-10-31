package com.alumniportal.alumni.repository;

import com.alumniportal.alumni.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {

    List<Achievement> findByStudentIdOrderByCreatedAtDesc(String studentId);

    // ✅ Now works correctly with new studentEmail field
    List<Achievement> findByStudentEmailOrderByCreatedAtDesc(String email);
}
