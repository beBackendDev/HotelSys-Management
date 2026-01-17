package com.thoaidev.bookinghotel.summary.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDailyRevenueDto {
    private LocalDate date;
    private Integer bookingCount;           // Số booking trong ngày
    private BigDecimal revenue;             // Doanh thu trong ngày
}