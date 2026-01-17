package com.thoaidev.bookinghotel.summary.admin.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminTopOwnerDTO {
    private Integer ownerId;
    private String ownerName;
    private Integer hotelCount;             // Số khách sạn sở hữu
    private Integer roomCount;              // Số phòng sở hữu
    private BigDecimal revenue;             // Tổng doanh thu
    private Integer bookingCount;           // Tổng booking
}