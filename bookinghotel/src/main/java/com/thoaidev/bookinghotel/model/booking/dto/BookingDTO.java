package com.thoaidev.bookinghotel.model.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.thoaidev.bookinghotel.model.enums.BookingStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingDTO {
    // private Integer bookingId;
    private Integer hotelId;
    private Integer roomId;
    // private Integer userId;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    private BigDecimal totalPrice;
    private BookingStatus status;
    
    // Thông tin khách ở
    private String guestFullName;
    private String guestPhone;
    private String guestEmail;
    private String guestCccd;

}
