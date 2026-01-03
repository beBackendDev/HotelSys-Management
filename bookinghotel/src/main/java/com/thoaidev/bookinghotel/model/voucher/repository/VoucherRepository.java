package com.thoaidev.bookinghotel.model.voucher.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thoaidev.bookinghotel.model.voucher.entity.Voucher;
import com.thoaidev.bookinghotel.model.voucher.enums.VoucherStatus;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {

    Optional<Voucher> findByCodeAndStatus(String code, VoucherStatus status);
}
