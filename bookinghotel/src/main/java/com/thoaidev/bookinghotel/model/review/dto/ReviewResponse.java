package com.thoaidev.bookinghotel.model.review.dto;

import java.util.List;

import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
     private List<HotelReviewDTO> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPage;
    private boolean last;
}
