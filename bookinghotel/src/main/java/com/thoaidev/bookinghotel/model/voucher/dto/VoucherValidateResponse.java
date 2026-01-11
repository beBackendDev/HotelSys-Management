package com.thoaidev.bookinghotel.model.voucher.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VoucherValidateResponse {

    private String voucherCode;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
}
