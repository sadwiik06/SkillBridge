package com.saisadwiik.skillbridge_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saisadwiik.skillbridge_backend.models.Milestone;

public interface MilestoneRepository extends JpaRepository <Milestone,Long>{
    List<Milestone> findByProjectId(Long projectId);

}
