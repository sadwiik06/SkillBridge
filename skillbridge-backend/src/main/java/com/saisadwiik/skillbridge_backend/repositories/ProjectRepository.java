package com.saisadwiik.skillbridge_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saisadwiik.skillbridge_backend.Enum.ProjectCategory;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.User;

public interface ProjectRepository extends JpaRepository<Project, Long>{
    List<Project> findByClient(User client);

    List<Project> findByStatus(ProjectStatus open);
    List<Project> findByCategoryAndStatus(ProjectCategory category, ProjectStatus status);

    // Find projects where the title contains a keyword  AND category matches
    List<Project> findByTitleContainingIgnoreCaseAndCategory(String title, ProjectCategory category);

    // Find projects where the title contains a keyword AND status matches
    List<Project> findByTitleContainingIgnoreCaseAndStatus(String title, ProjectStatus status);
}
