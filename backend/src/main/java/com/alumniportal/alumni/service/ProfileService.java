package com.alumniportal.alumni.service;

import com.alumniportal.alumni.dto.ProfileDTO;
import com.alumniportal.alumni.entity.Profile;
import com.alumniportal.alumni.entity.User;
import com.alumniportal.alumni.repository.ProfileRepository;
import com.alumniportal.alumni.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // ✅ Get Profile by Email
    public ProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = createDefaultProfile(user);
        }

        return convertToDTO(profile);
    }

    // ✅ Update Profile by Email
    public ProfileDTO updateProfileByEmail(String email, ProfileDTO updatedProfileDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = createDefaultProfile(user);
        }

        // --- Basic info ---
        profile.setFirstName(updatedProfileDTO.getFirstName());
        profile.setLastName(updatedProfileDTO.getLastName());
        profile.setPhone(updatedProfileDTO.getPhone());
        profile.setBatch(updatedProfileDTO.getBatch());
        profile.setAbout(updatedProfileDTO.getAbout());

        // --- Academic & Professional ---
        profile.setGraduationYear(updatedProfileDTO.getGraduationYear());
        profile.setDegree(updatedProfileDTO.getDegree());
        profile.setBranch(updatedProfileDTO.getBranch());
        profile.setCurrentCompany(updatedProfileDTO.getCurrentCompany());
        profile.setPosition(updatedProfileDTO.getPosition());

        // ✅ Preserve existing photo if not changed
        if (updatedProfileDTO.getProfilePhoto() != null && !updatedProfileDTO.getProfilePhoto().isEmpty()) {
            profile.setProfilePhoto(updatedProfileDTO.getProfilePhoto());
        }

        Profile updatedProfile = profileRepository.save(profile);
        return convertToDTO(updatedProfile);
    }

    // ✅ Create Default Profile
    private Profile createDefaultProfile(User user) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setEmail(user.getEmail());
        profile.setFirstName("First Name");
        profile.setLastName("Last Name");
        profile.setPhone("");
        profile.setAbout("");
        profile.setBatch("");
        profile.setProfilePhoto("");

        // --- Initialize academic/professional ---
        profile.setGraduationYear("");
        profile.setDegree("");
        profile.setBranch("");
        profile.setCurrentCompany("");
        profile.setPosition("");

        Profile savedProfile = profileRepository.save(profile);
        user.setProfile(savedProfile);
        userRepository.save(user);
        return savedProfile;
    }

    // ✅ Convert Entity → DTO
    private ProfileDTO convertToDTO(Profile profile) {
        ProfileDTO dto = new ProfileDTO();
        dto.setId(profile.getId());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setEmail(profile.getEmail());
        dto.setPhone(profile.getPhone());
        dto.setBatch(profile.getBatch());
        dto.setAbout(profile.getAbout());
        dto.setProfilePhoto(profile.getProfilePhoto());

        dto.setGraduationYear(profile.getGraduationYear());
        dto.setDegree(profile.getDegree());
        dto.setBranch(profile.getBranch());
        dto.setCurrentCompany(profile.getCurrentCompany());
        dto.setPosition(profile.getPosition());
        return dto;
    }

    // ✅ Optional: Profile photo upload (can use later)
    public ProfileDTO updateProfilePhoto(String email, MultipartFile file) {
        ProfileDTO dto = getProfileByEmail(email);
        dto.setProfilePhoto(file.getOriginalFilename());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Profile profile = user.getProfile();
        profile.setProfilePhoto(file.getOriginalFilename());
        Profile updated = profileRepository.save(profile);
        return convertToDTO(updated);
    }
}
