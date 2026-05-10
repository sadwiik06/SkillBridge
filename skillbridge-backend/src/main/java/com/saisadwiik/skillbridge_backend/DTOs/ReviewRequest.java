package com.saisadwiik.skillbridge_backend.DTOs;

import lombok.Data;

@Data
public class ReviewRequest {
    private int rating;
    private String comment;

}
