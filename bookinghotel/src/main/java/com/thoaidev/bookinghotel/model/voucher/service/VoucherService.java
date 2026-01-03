package com.thoaidev.bookinghotel.model.voucher.service;

import java.math.BigDecimal;

import com.thoaidev.bookinghotel.model.voucher.entity.Voucher;

public interface VoucherService {
    public Voucher validateVoucher(
            String code,
            BigDecimal totalAmount
    );
 public BigDecimal calculateDiscount(Voucher voucher, BigDecimal totalAmount);
}
