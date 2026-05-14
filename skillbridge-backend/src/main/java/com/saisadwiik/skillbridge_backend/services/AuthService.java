package com.saisadwiik.skillbridge_backend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.saisadwiik.skillbridge_backend.DTOs.AuthDTOs.AuthResponse;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;
import com.saisadwiik.skillbridge_backend.security.JwtUtils;

@Service
public class AuthService {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user){
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return null;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<AuthResponse> login(String email, String password) {
        return userRepository.findByEmail(email)
            .filter(user -> passwordEncoder.matches(password, user.getPassword()))
            .map(user -> {
                String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());
                return new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getName());
            });
    }

    private static final String PASSWORD_PATTERN =
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";

    public static void validatePassword(String password){
        if(password == null){
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if(!password.matches(PASSWORD_PATTERN)){
            if(password.length() < 8){
                throw new IllegalArgumentException("Password must be at least 8 characters long");
            }
            if(!password.matches(".*[A-Z].*")){
                throw new IllegalArgumentException("Password must contain at least one uppercase character");
            }
            if(!password.matches(".*[a-z].*")){
                throw new IllegalArgumentException("Password must contain at least one lowercase letter");
            }
            if(!password.matches(".*[0-9].*")){
                throw new IllegalArgumentException("Password must contain at least one number");
            } 
            if(!password.matches(".*[@#$%^&+=!].*")){
                throw new IllegalArgumentException("Password must contain one special character");
            } 
        }
    }
}
