package com.thoaidev.bookinghotel.model.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.thoaidev.bookinghotel.model.enums.BookingStatus;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BookingDTO {

    private Integer bookingId;
    private Integer hotelId;
    private String hotelName;
    private Integer roomId;
    private String roomName;
    // private Integer userId;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;

    private String voucherCode;
    private BigDecimal totalPrice;
    private BigDecimal discountAmount;
    private BigDecimal totalPriceAfterDiscount;
    
    private BookingStatus status;
    private LocalDateTime createdAt;

    // Thông tin khách ở
    private String guestFullName;
    private String guestPhone;
    private String guestEmail;
    private String guestCccd;

    //validate review 
    private boolean canReview;

}
