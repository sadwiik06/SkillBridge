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
import org.springframework.web.bind.annotation.RestController;

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
        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }



}
