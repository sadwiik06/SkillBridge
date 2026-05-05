package com.saisadwiik.skillbridge_backend.controllers;

import java.security.Principal;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.DTOs.AuthDTOs.AuthResponse;
import com.saisadwiik.skillbridge_backend.DTOs.AuthDTOs.LoginRequest;
import com.saisadwiik.skillbridge_backend.DTOs.UserDTO;
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
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole().name());
                    dto.setTotalBalance(user.getTotalBalance() != null ? user.getTotalBalance() : 0.0);
                    dto.setLockedBalance(user.getLockedBalance() != null ? user.getLockedBalance() : 0.0);
                    return ResponseEntity.ok((Object) dto);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }



}
