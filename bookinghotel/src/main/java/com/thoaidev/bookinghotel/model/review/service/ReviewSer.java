package com.thoaidev.bookinghotel.model.review.service;

import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;
import com.thoaidev.bookinghotel.model.review.dto.ReviewResponse;

public interface ReviewSer {

    public void createReview(HotelReviewDTO hotelReviewDTO);

    public ReviewResponse getReviewsByHotelId(Integer hotelId, int pageNo, int pageSize);

    public ReviewResponse getReviewsByUserId(Integer userId, int pageNo, int pageSize);//Xem lích sủ đánh giá của người dùng

    public ReviewResponse getAllReviews(int pageNo, int pageSize);

    public ReviewResponse getReviewForOwner(Integer ownerId, int pageNo, int pageSize);
}
