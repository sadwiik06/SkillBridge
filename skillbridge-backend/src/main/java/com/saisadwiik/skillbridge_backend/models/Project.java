package com.saisadwiik.skillbridge_backend.models;

import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="projects")
@Getter
@Setter


public class Project {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Double budget;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.OPEN;

    @ManyToOne
    @JoinColumn(name="client_id")
    private User client;
    @ManyToOne
    @JoinColumn(name="freelancer_id")
    private User freelancer;
    @Enumerated(EnumType.STRING)
    private ProjectCategory category;

    

}
