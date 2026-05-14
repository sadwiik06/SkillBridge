package com.saisadwiik.skillbridge_backend.controllers;

import java.security.Principal;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.Cloudinary;

import com.saisadwiik.skillbridge_backend.DTOs.AuthDTOs.AuthResponse;
import com.saisadwiik.skillbridge_backend.DTOs.AuthDTOs.LoginRequest;
import com.saisadwiik.skillbridge_backend.DTOs.UserDTO;
import com.saisadwiik.skillbridge_backend.DTOs.UserUpdateDTO;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;
import com.saisadwiik.skillbridge_backend.services.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private com.saisadwiik.skillbridge_backend.repositories.ProjectRepository projectRepository;
    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.register(user);
            return ResponseEntity.ok("User registered successfully with ID: " + registeredUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<AuthResponse> response = authService.login(
            loginRequest.email(), 
            loginRequest.password()
        );

        if (response.isPresent()) {
            return ResponseEntity.ok(response.get());
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal){
        if (principal == null){
            return ResponseEntity.status(401).body("Not authenticated");
        }
        String email = principal.getName();
        return userRepository.findByEmail(email)
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole().name());
                    dto.setTotalBalance(user.getTotalBalance() != null ? user.getTotalBalance() : 0.0);
                    dto.setLockedBalance(user.getLockedBalance() != null ? user.getLockedBalance() : 0.0);
                    dto.setBio(user.getBio());
                    dto.setSkills(user.getSkills());
                    dto.setAverageRating(user.getAverageRating());
                    dto.setTotalReviews(user.getTotalReviews());
                    dto.setPhotoPath(user.getPhotoPath());

                    
                    if (user.getRole() == com.saisadwiik.skillbridge_backend.Enum.Role.ROLE_CLIENT) {
                        long posted = projectRepository.countByClient(user);
                        long hired = projectRepository.countByClientAndFreelancerIsNotNull(user);
                        dto.setProjectsPosted(posted);
                        dto.setProjectsCompleted(projectRepository.countByClientAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.COMPLETED));
                        dto.setProjectsInProgress(projectRepository.countByClientAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.IN_PROGRESS));
                        dto.setTotalFreelancersHired(projectRepository.countUniqueFreelancersByClient(user));
                        
                        dto.setHireRate(posted > 0 ? (double) hired / posted * 100 : 0.0);
                        Double spent = projectRepository.sumBudgetByClientAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.COMPLETED);
                        dto.setTotalSpent(spent != null ? spent : 0.0);
                    } else if (user.getRole() == com.saisadwiik.skillbridge_backend.Enum.Role.ROLE_FREELANCER) {
                        long total = projectRepository.countByFreelancer(user);
                        long completed = projectRepository.countByFreelancerAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.COMPLETED);
                        long inProgress = projectRepository.countByFreelancerAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.IN_PROGRESS);
                        
                        dto.setProjectsCompleted(completed);
                        dto.setProjectsInProgress(inProgress);
                        dto.setSuccessRate(total > 0 ? (double) completed / total * 100 : 0.0);
                        
                        // Factual Trust Score: (Rating * 0.7) + (SuccessRate * 0.3)
                        double ratingFactor = (user.getAverageRating() != null ? user.getAverageRating() : 0.0) * 20; // scale 5 to 100
                        double successFactor = (total > 0 ? (double) completed / total * 100 : 0.0);
                        dto.setTrustScore(total > 0 ? (ratingFactor * 0.7) + (successFactor * 0.3) : ratingFactor);
                    }
                    
                    return ResponseEntity.ok((Object) dto);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getPublicProfile(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    // Do NOT expose email or balances for public profiles
                    dto.setRole(user.getRole().name());
                    dto.setBio(user.getBio());
                    dto.setSkills(user.getSkills());
                    dto.setAverageRating(user.getAverageRating());
                    dto.setTotalReviews(user.getTotalReviews());
                    dto.setPhotoPath(user.getPhotoPath());


                    if (user.getRole() == com.saisadwiik.skillbridge_backend.Enum.Role.ROLE_CLIENT) {
                        long posted = projectRepository.countByClient(user);
                        long hired = projectRepository.countByClientAndFreelancerIsNotNull(user);
                        dto.setProjectsPosted(posted);
                        dto.setProjectsCompleted(projectRepository.countByClientAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.COMPLETED));
                        dto.setProjectsInProgress(projectRepository.countByClientAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.IN_PROGRESS));
                        dto.setTotalFreelancersHired(projectRepository.countUniqueFreelancersByClient(user));
                        
                        dto.setHireRate(posted > 0 ? (double) hired / posted * 100 : 0.0);
                        Double spent = projectRepository.sumBudgetByClientAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.COMPLETED);
                        dto.setTotalSpent(spent != null ? spent : 0.0);
                    } else if (user.getRole() == com.saisadwiik.skillbridge_backend.Enum.Role.ROLE_FREELANCER) {
                        long total = projectRepository.countByFreelancer(user);
                        long completed = projectRepository.countByFreelancerAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.COMPLETED);
                        long inProgress = projectRepository.countByFreelancerAndStatus(user, com.saisadwiik.skillbridge_backend.Enum.ProjectStatus.IN_PROGRESS);
                        
                        dto.setProjectsCompleted(completed);
                        dto.setProjectsInProgress(inProgress);
                        dto.setSuccessRate(total > 0 ? (double) completed / total * 100 : 0.0);
                        
                        double ratingFactor = (user.getAverageRating() != null ? user.getAverageRating() : 0.0) * 20; 
                        double successFactor = (total > 0 ? (double) completed / total * 100 : 0.0);
                        dto.setTrustScore(total > 0 ? (ratingFactor * 0.7) + (successFactor * 0.3) : ratingFactor);
                    }
                    
                    return ResponseEntity.ok((Object) dto);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }
    @PostMapping("/me/skills")
    public ResponseEntity<?> updateSkills(@RequestBody Set<String> skills,Principal principal)
    {
        User user=userRepository.findByEmail(principal.getName()).orElseThrow();
        user.setSkills(skills);
        userRepository.save(user);
        return ResponseEntity.ok("Skills updated successfully");
    }
    @PutMapping("/me/update")
    public ResponseEntity<?> updateProfile(@RequestBody UserUpdateDTO updateData,Principal principal){
        User user=userRepository.findByEmail(principal.getName()).orElseThrow();
        user.setBio(updateData.getBio());
        user.setSkills(updateData.getSkills());
        if(updateData.getPhotoPath() != null && !updateData.getPhotoPath().isEmpty()) {
            user.setPhotoPath(updateData.getPhotoPath());
        }
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/me/photo")
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file, Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName()).orElseThrow();
            java.util.Map uploadResult = cloudinary.uploader().upload(file.getBytes(), com.cloudinary.utils.ObjectUtils.asMap(
                "folder", "SocialMedia/skillbridgeprofile",
                "resource_type", "image"
            ));
            String photoUrl = uploadResult.get("secure_url").toString();
            user.setPhotoPath(photoUrl);
            userRepository.save(user);
            return ResponseEntity.ok(java.util.Collections.singletonMap("photoUrl", photoUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        }
    }

}
