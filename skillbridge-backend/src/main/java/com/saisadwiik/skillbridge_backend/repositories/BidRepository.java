package com.saisadwiik.skillbridge_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saisadwiik.skillbridge_backend.models.Bid;
import com.saisadwiik.skillbridge_backend.models.Project;

public interface BidRepository extends JpaRepository<Bid,Long>{
    List<Bid> findByProject(Project project);
    List<Bid> findByFreelancerId(Long freelancerId);

}
