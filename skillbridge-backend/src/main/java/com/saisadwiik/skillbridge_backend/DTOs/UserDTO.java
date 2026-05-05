package com.saisadwiik.skillbridge_backend.DTOs;
import lombok.Data;

@Data
public class UserDTO{
    private String name;
    private String email;
    private String role;
    private Double totalBalance;
    private Double lockedBalance;
    
}
