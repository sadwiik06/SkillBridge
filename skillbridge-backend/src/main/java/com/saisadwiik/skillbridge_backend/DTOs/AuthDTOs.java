package com.saisadwiik.skillbridge_backend.DTOs;

import com.saisadwiik.skillbridge_backend.Enum.Role;

public class AuthDTOs {
    public record AuthRequest(String email, String password, String name, Role role) {}
    public record LoginRequest(String email, String password) {}
    // a small response class for the frontend, instead of sending token inside the header
    public record AuthResponse(String token, String email, String role, String name) {}

}
