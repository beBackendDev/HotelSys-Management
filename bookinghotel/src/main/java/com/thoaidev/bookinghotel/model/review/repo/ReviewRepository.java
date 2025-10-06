package com.thoaidev.bookinghotel.model.review.repo;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thoaidev.bookinghotel.model.hotel.entity.HotelReview;
import com.thoaidev.bookinghotel.model.review.entity.Review;

public interface ReviewRepository extends JpaRepository<HotelReview, Integer> {

    @Query("SELECT AVG(r.ratingPoint) FROM HotelReview r WHERE r.hotel.hotelId = :hotelId")
    Double getAverageRatingByHotelId(@Param("hotelId") Integer hotelId);

    Integer countByHotel_HotelId(Integer hotelId);

    List<HotelReview> findByHotel_HotelId(Integer hotelId);
    Page<HotelReview> findByHotel_HotelId(Integer hotelId, Pageable pageable);
    Page<HotelReview> findByUser_UserId(Integer userId, Pageable pageable);
}
