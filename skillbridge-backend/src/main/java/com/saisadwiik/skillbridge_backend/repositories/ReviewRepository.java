package com.saisadwiik.skillbridge_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saisadwiik.skillbridge_backend.models.Review;
import com.saisadwiik.skillbridge_backend.models.User;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    List<Review> findByReviewedUser(User user);


}
