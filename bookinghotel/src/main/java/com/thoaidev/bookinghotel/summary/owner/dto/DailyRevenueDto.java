package com.thoaidev.bookinghotel.summary.owner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyRevenueDto {
    private LocalDate date;
    private Integer totalBooking;
    private BigDecimal totalRevenue;
}
