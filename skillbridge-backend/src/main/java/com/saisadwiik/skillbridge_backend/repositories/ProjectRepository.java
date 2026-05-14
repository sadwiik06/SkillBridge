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
    List<Project> findByFreelancer(User freelancer);
    long countByClient(User client);
    long countByClientAndStatus(User client, ProjectStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT p.freelancer) FROM Project p WHERE p.client = :client AND p.freelancer IS NOT NULL")
    long countUniqueFreelancersByClient(@org.springframework.data.repository.query.Param("client") User client);

    long countByClientAndFreelancerIsNotNull(User client);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(p.budget) FROM Project p WHERE p.client = :client AND p.status = :status")
    Double sumBudgetByClientAndStatus(@org.springframework.data.repository.query.Param("client") User client, @org.springframework.data.repository.query.Param("status") com.saisadwiik.skillbridge_backend.Enum.ProjectStatus status);

    long countByFreelancer(User freelancer);
    long countByFreelancerAndStatus(User freelancer, ProjectStatus status);
}
