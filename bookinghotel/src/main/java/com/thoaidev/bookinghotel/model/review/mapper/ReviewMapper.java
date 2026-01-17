package com.thoaidev.bookinghotel.model.review.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.hotel.entity.HotelReview;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;

@Component
public class ReviewMapper {
    public HotelReviewDTO toDTO(HotelReview review){
        //check null gia tri review
        if (review == null) 
            return null;

        return HotelReviewDTO.builder()
            .id(review.getId())
            .hotelId(review.getHotel().getHotelId())
            .hotelName(review.getHotel().getHotelName())
            .fullName(review.getUser().getFullname())
            .userId(review.getUser().getUserId())
            .ratingPoint(review.getRatingPoint())
            .comment(review.getComment())
            .createdAt(review.getCreatedAt())
            .build();
    }
        public List<HotelReviewDTO> toDTOList(List<HotelReview> reviews) {
        return reviews.stream().map(this::toDTO).toList();
    }
}
