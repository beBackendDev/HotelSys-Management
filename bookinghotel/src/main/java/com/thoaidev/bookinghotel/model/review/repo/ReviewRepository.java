package com.thoaidev.bookinghotel.model.review.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thoaidev.bookinghotel.model.hotel.entity.HotelReview;

public interface ReviewRepository extends JpaRepository<HotelReview, Integer> {

    @Query("SELECT AVG(r.ratingPoint) FROM HotelReview r WHERE r.hotel.hotelId = :hotelId")
    //Tính điểm đánh giá trung bình của khách sạn
    Double getAverageRatingByHotelId(@Param("hotelId") Integer hotelId);

    Integer countByHotel_HotelId(Integer hotelId);

    List<HotelReview> findByHotel_HotelId(Integer hotelId);

    Page<HotelReview> findByHotel_HotelId(Integer hotelId, Pageable pageable);

    Page<HotelReview> findByUser_UserId(Integer userId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END "
            + "FROM HotelReview r "
            + "WHERE r.user.userId = :userId "
            + "AND r.hotel.hotelId = :hotelId")
    boolean existReview(@Param("userId") Integer userId,
            @Param("hotelId") Integer hotelId);

    @Query("SELECT r FROM HotelReview r WHERE r.user.userId = :userId AND r.hotel.hotelId = :hotelId")
    Optional<HotelReview> findOptionalByUserIdAndHotelId(
            @Param("userId") Integer userId,
            @Param("hotelId") Integer hotelId
    );

}
