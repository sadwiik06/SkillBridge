package com.saisadwiik.skillbridge_backend.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saisadwiik.skillbridge_backend.DTOs.ReviewRequest;
import com.saisadwiik.skillbridge_backend.services.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;
    @PostMapping("/{projectId}")
    public ResponseEntity<?> postReview(@PathVariable Long projectId, @RequestBody ReviewRequest req,Principal principal){
        reviewService.submitReview(projectId, req.getRating(), req.getComment(),principal.getName());
        return ResponseEntity.ok("Review submitted and rating updated");
    }


}
