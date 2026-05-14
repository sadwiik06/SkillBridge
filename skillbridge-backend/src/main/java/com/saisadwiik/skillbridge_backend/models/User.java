package com.saisadwiik.skillbridge_backend.models;

import java.util.HashSet;
import java.util.Set;

import com.saisadwiik.skillbridge_backend.Enum.Role;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String name;
    @Column(length=500)
    private String bio;
    private String photoPath;
    @Column(columnDefinition="DOUBLE DEFAULT 0.0")
    private Double averageRating=0.0;
    @Column(columnDefinition="INTEGER DEFAULT 0")
    private Integer totalReviews=0;
    @ElementCollection(targetClass=String.class,fetch=FetchType.EAGER)
    @CollectionTable(name="user_skills",joinColumns=@JoinColumn(name="user_id"))
    @Column(name="skill_name")

    private Set<String> skills = new HashSet<>();


    private Double totalBalance = 0.0;
    private Double lockedBalance = 0.0;

}
