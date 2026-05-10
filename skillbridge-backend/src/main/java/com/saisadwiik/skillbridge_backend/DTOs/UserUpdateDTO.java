package com.saisadwiik.skillbridge_backend.DTOs;

import java.util.Set;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String bio;
    private String photoPath;
    private Set<String> skills;
}
