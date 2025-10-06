package com.thoaidev.bookinghotel.model.review.dto;

import groovy.transform.builder.Builder;
import lombok.Data;



@Data
@Builder
public class ReviewDto {

    private Integer hotelId;
    private Integer userId;
    private String rating;
    private String comment;
}
