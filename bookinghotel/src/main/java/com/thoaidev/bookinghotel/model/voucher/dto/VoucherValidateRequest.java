package com.thoaidev.bookinghotel.model.voucher.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VoucherValidateRequest {

    private String voucherCode;

    private Integer roomId;
    private Integer hotelId;

    private LocalDate checkIn;
    private LocalDate checkOut;
}
