package com.saisadwiik.skillbridge_backend.models;

import org.hibernate.boot.model.internal.StrictIdGeneratorResolverSecondPass;

import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

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
    private String submissionUrl;
    private String submissionComment;

    private boolean isReviewed = false;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Milestone> milestones;
}
