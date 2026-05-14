package com.saisadwiik.skillbridge_backend.DTOs;
import lombok.Data;

@Data
public class UserDTO{
    private Long id;
    private String name;
    private String email;
    private String role;
    private Double totalBalance;
    private Double lockedBalance;
    private String bio;
    private java.util.Set<String> skills;
    private Double averageRating;
    private Integer totalReviews;
    private Long projectsPosted;
    private Long projectsCompleted;
    private Long projectsInProgress;
    private Long totalFreelancersHired;
    private Double hireRate;
    private Double totalSpent;
    private Double successRate;
    private Double trustScore;
    private String photoPath;
    
}
