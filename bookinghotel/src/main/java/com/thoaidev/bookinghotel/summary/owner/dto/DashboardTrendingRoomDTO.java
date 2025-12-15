package com.thoaidev.bookinghotel.summary.owner.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardTrendingRoomDTO {

    private Integer roomId;
    private String roomName;
    private String hotelName;

    // số liệu xếp hạng
    private Integer bookingCount;      // số lượt đặt
    private Integer bookedNights;       // tổng số đêm
    private BigDecimal revenue;      // doanh thu từ phòng

    // thông tin hiển thị
    private Integer rank;            // thứ hạng (1,2,3...)



}
