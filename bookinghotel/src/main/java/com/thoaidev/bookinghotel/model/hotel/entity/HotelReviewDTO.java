package com.thoaidev.bookinghotel.model.hotel.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class HotelReviewDTO {

    private Integer id;
    private Integer hotelId;
    //Khoong cần lấy userId vì User được lấy từ token rồi
    private Integer userId;
    private Double ratingPoint; // 1 - 5 (số sao)
    private String comment;  // nội dung đánh giá
    private LocalDateTime createdAt;

}
