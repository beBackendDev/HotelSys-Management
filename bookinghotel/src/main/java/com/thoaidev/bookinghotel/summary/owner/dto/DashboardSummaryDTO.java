package com.thoaidev.bookinghotel.summary.owner.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private BigDecimal totalRevenue; //Tổng doanh thu 
    private Integer totalBookings; //tổng số booking
    private Integer totalRooms; //tổng phòng
    private Double occupancyRate; //ti le dat phong
    private Double revenueGrowthRate; //tăng trưởng doanh thu
    private Integer cancelledBookings; //tổng booking canceled 
}
