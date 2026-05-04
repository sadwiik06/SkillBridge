package com.saisadwiik.skillbridge_backend.models;

import com.saisadwiik.skillbridge_backend.Enum.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable=false)
    private String email;
    @Column(nullable= false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;
    private String photoPath;


    private Double totalBalance = 0.0;
    private Double lockedBalance = 0.0;

}
