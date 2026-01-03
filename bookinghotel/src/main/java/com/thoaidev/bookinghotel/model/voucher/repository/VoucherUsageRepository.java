package com.thoaidev.bookinghotel.model.voucher.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thoaidev.bookinghotel.model.voucher.entity.VoucherUsage;

public interface VoucherUsageRepository extends JpaRepository<VoucherUsage, Integer> {

    boolean existsByIdAndUserId(Integer voucherId, Integer userId);

    List<VoucherUsage> findByBookingId(Integer bookingId);
}

