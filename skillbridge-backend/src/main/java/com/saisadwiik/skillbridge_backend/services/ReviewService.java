package com.saisadwiik.skillbridge_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.saisadwiik.skillbridge_backend.Enum.ProjectStatus;
import com.saisadwiik.skillbridge_backend.models.Project;
import com.saisadwiik.skillbridge_backend.models.Review;
import com.saisadwiik.skillbridge_backend.models.User;
import com.saisadwiik.skillbridge_backend.repositories.ProjectRepository;
import com.saisadwiik.skillbridge_backend.repositories.ReviewRepository;
import com.saisadwiik.skillbridge_backend.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired 
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Transactional
    public void submitReview(Long projectId,int rating,String comment,String clientEmail){
        Project project=projectRepository.findById(projectId).orElseThrow();
        if(!project.getClient().getEmail().equals(clientEmail)){
            throw new RuntimeException("Unauthorized to review this project");

        }
        if(project.getStatus()!=ProjectStatus.COMPLETED){
            throw new RuntimeException("Project must be completed before review");
        }
        if(project.isReviewed()){
            throw new RuntimeException("Review already submitted for this project");
        }
        User freelancer=project.getFreelancer();
        Review review=new Review();
        review.setProject(project);
        review.setRating(rating);
        review.setComment(comment);
        review.setReviewer(project.getClient());
        review.setReviewedUser(freelancer);
        reviewRepository.save(review);
        //formula=((currentavg*totalreviews)+newrating/(totalreviews+1))
        double currentAvg=freelancer.getAverageRating()!=null ? freelancer.getAverageRating():0.0;
        int totalreviews=freelancer.getTotalReviews()!=null?freelancer.getTotalReviews():0;
        double newAvg=((currentAvg*totalreviews)+rating)/(totalreviews+1);
        freelancer.setTotalReviews(totalreviews+1);
        freelancer.setAverageRating(newAvg);
        project.setReviewed(true);
        userRepository.save(freelancer);
        projectRepository.save(project);
    }
    
}
