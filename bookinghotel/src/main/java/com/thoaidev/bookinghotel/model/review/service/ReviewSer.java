package com.thoaidev.bookinghotel.model.review.service;

import java.util.List;

import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;
import com.thoaidev.bookinghotel.model.review.dto.ReviewResponse;

public interface ReviewSer {

    public void createReview(HotelReviewDTO hotelReviewDTO);

    public ReviewResponse getReviewsByHotelId(Integer hotelId, int pageNo, int pageSize);

    public ReviewResponse getReviewsByUserId(Integer userId, int pageNo, int pageSize);

    public ReviewResponse getAllReviews(int pageNo, int pageSize);
}
