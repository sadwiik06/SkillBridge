package com.saisadwiik.skillbridge_backend.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.models.Bid;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;
import com.saisadwiik.skillbridge_backend.services.BidService;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins="*")
public class BidController {
    @Autowired
    private BidService bidService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestParam Long projectId, @RequestBody Bid bid, Principal principal){
        User freelancer=userRepository.findByEmail(principal.getName()).orElseThrow();
        try{
            return ResponseEntity.ok(bidService.placeBid(projectId, bid, freelancer));

        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Bid>> getBidsByProject(@PathVariable Long projectId){
        var project = projectRepository.findById(projectId).orElseThrow();
        return ResponseEntity.ok(bidService.getBidsForProject(project));
    }
    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Long bidId,Principal principal){
        try{
            bidService.acceptBid(bidId,principal.getName());
            return ResponseEntity.ok("Bid Accepted and Funds Allocated");
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    
    @GetMapping("/my-bids")
    public ResponseEntity<List<Bid>> getMyBids(Principal principal){
        return ResponseEntity.ok(bidService.getBidsByFreelancer(principal.getName()));
    }
}
