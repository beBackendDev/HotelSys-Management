package com.thoaidev.bookinghotel.summary.admin.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardSummaryDTO {
    private BigDecimal totalRevenue;              // Tổng doanh thu
    private Long totalBookings;           // Tổng booking
    private Integer totalRooms;              // Tổng phòng trong hệ thống
    private Integer totalHotels;             // Tổng khách sạn
    private Integer totalUsers;              // Tổng người dùng
    private Integer totalOwners;             // Tổng chủ sở hữu
    private Double occupancyRate;                // Tỉ lệ chiếm dụng phòng (%)
    private Double revenueGrowthRate;        // Tỉ lệ tăng trưởng doanh thu (%)
    private Long cancelledBookings;       // Tổng booking bị hủy
}