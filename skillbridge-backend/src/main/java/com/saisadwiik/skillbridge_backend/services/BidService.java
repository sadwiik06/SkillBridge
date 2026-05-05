package com.saisadwiik.skillbridge_backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.BindStatus;

import com.saisadwiik.skillbridge_backend.Enum.BidStatus;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Bid;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.BidRepository;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;

import jakarta.transaction.Transactional;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Transactional
    public Bid placeBid(Long projectId, Bid bid,User freelancer){
        Project project=projectRepository.findById(projectId).orElseThrow();
        if(project.getStatus() != ProjectStatus.OPEN){
            throw new RuntimeException("Project is no longer accepting bids");
        }
        bid.setProject(project);
        bid.setFreelancer(freelancer);
        return bidRepository.save(bid);
    }
    @Transactional
    public void acceptBid(Long bidId,String clientEmail){
        Bid bid=bidRepository.findById(bidId).orElseThrow();
        Project project=bid.getProject();
        if(!project.getClient().getEmail().equals(clientEmail)){
            throw new RuntimeException("Unauthorized to accept bids for this project");
        }
        project.setFreelancer(bid.getFreelancer());
        project.setStatus(ProjectStatus.IN_PROGRESS);
        bid.setStatus(BidStatus.ACCEPTED);
        List<Bid> otherBids=bidRepository.findByProject(project);
        for(Bid other:otherBids){
            if(!other.getId().equals(bidId)){
                other.setStatus(BidStatus.REJECTED);;
            }
        }
        bidRepository.save(bid);
        projectRepository.save(project);
        
    }

}
