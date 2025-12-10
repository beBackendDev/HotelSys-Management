package com.thoaidev.bookinghotel.model.review.dto;

import java.time.LocalDateTime;

import groovy.transform.builder.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;



@Data
@AllArgsConstructor
public class ReviewDto {
    private String comment;
    private Double ratingPoint; // 1 - 5 (số sao)
    private LocalDateTime createdAt;

}
