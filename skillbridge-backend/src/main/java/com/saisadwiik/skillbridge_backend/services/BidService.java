package com.saisadwiik.skillbridge_backend.services;

import java.util.List;

import javax.print.DocPrintJob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.saisadwiik.skillbridge_backend.Enum.BidStatus;
import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Bid;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.Transaction;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.BidRepository;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.TransactionRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Transactional
    public Bid placeBid(Long projectId, Bid bid,User freelancer){
        Project project=projectRepository.findById(projectId).orElseThrow();
        if(project.getStatus() != ProjectStatus.OPEN){
            throw new RuntimeException("Project is no longer accepting bids");
        }
        boolean alreadyBided=bidRepository.existsByProjectAndFreelancer(project,freelancer);
        if(alreadyBided) throw new RuntimeException("You have already placed bid");
        bid.setProject(project);
        bid.setFreelancer(freelancer);
        return bidRepository.save(bid);
    }
    @Transactional
    public void acceptBid(Long bidId,String clientEmail){
        Bid bid=bidRepository.findById(bidId).orElseThrow();
        Project project=bid.getProject();
        User client=project.getClient();
        if(!project.getClient().getEmail().equals(clientEmail)){
            throw new RuntimeException("Unauthorized to accept bids for this project");
        }
        
        Double originalBudget=project.getBudget();
        
        // If the project has NO milestones, the freelancer can bid a variable amount
        if (project.getMilestones() == null || project.getMilestones().isEmpty()) {
            Double agreedPrice = bid.getBidAmount();
            if (agreedPrice != null) {
                if (agreedPrice > originalBudget) {
                    throw new RuntimeException("Insufficient locked funds. Bid exceeds budget.");
                }
                if (agreedPrice < originalBudget) {
                    Double savings = originalBudget - agreedPrice;
                    client.setLockedBalance(client.getLockedBalance() - savings);
                    
                    Transaction tx = new Transaction();
                    tx.setUser(client);
                    tx.setAmount(savings);
                    tx.setType("BID_ADJUSTMENT");
                    tx.setDescription("Refund due to lower accepted bid for " + project.getTitle());
                    transactionRepository.save(tx);
                    
                    project.setBudget(agreedPrice);
                }
            }
        }
        
        project.setFreelancer(bid.getFreelancer());
        project.setStatus(ProjectStatus.IN_PROGRESS);
        bid.setStatus(BidStatus.ACCEPTED);
        List<Bid> otherBids=bidRepository.findByProject(project);
        for(Bid other:otherBids){
            if(!other.getId().equals(bidId)){
                other.setStatus(BidStatus.REJECTED);
            }
        }
        userRepository.save(client);
        bidRepository.save(bid);
        projectRepository.save(project);
        
    }
    public List<Bid> getBidsForProject(Project project){
        return bidRepository.findByProject(project);
    }

    public List<Bid> getBidsByFreelancer(String email){
        User freelancer = userRepository.findByEmail(email).orElseThrow();
        return bidRepository.findByFreelancerId(freelancer.getId());
    }
}
