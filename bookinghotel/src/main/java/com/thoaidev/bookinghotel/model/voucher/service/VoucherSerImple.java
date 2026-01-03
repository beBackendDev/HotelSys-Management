package com.thoaidev.bookinghotel.model.voucher.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.voucher.entity.Voucher;
import com.thoaidev.bookinghotel.model.voucher.enums.VoucherStatus;
import com.thoaidev.bookinghotel.model.voucher.enums.VoucherType;
import com.thoaidev.bookinghotel.model.voucher.repository.VoucherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherSerImple implements VoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public Voucher validateVoucher(String code, BigDecimal totalAmount) {
        Voucher voucher = voucherRepository
                .findByCodeAndStatus(code, VoucherStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        if (voucher.getStartDate().isAfter(now)
                || voucher.getEndDate().isBefore(now)) {
            throw new RuntimeException("Voucher Expired");
        }

        if (voucher.getUsedCount() >= voucher.getQuantity()) {
            throw new RuntimeException("Voucher has no remaining uses");
        }

        if (totalAmount.compareTo(voucher.getMinOrderAmount()) < 0) {
            throw new RuntimeException("Insufficient amount to apply voucher");
        }

        return voucher;
    }

    @Override
    public BigDecimal calculateDiscount(Voucher voucher, BigDecimal totalAmount) {
        BigDecimal discount;

        if (voucher.getType() == VoucherType.PERCENT) {
            discount = totalAmount
                    .multiply(voucher.getValue())
                    .divide(BigDecimal.valueOf(100));
        } else {
            discount = voucher.getValue();
        }

        if (voucher.getMaxDiscount() != null) {
            discount = discount.min(voucher.getMaxDiscount());
        }

        return discount.min(totalAmount);

    }

}
