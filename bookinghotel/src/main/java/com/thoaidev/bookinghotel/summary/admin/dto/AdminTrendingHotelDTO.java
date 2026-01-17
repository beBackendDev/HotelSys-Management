package com.thoaidev.bookinghotel.summary.admin.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminTrendingHotelDTO {
    private Integer hotelId;
    private String hotelName;
    private String ownerName;               // Tên chủ sở hữu
    private Integer bookingCount;           // Số lượng booking
    private Integer bookedNights;           // Số đêm đã đặt
    private BigDecimal revenue;             // Doanh thu
    private Integer rank;                   // Xếp hạng
}