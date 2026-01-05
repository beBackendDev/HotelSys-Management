package com.thoaidev.bookinghotel.model.voucher.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.thoaidev.bookinghotel.model.voucher.enums.VoucherStatus;
import com.thoaidev.bookinghotel.model.voucher.enums.VoucherType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voucher_id")
    private Integer voucherId;

    @Column(name = "code", unique = true, nullable = false)
    private String code;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private VoucherType type; // PERCENT, FIXED

    @Column(name = "value")
    private BigDecimal value; // % hoặc số tiền

    @Column(name = "max-discount")
    private BigDecimal maxDiscount;

    @Column(name = "min-order-amount")
    private BigDecimal minOrderAmount;

    @Column(name = "quantity")
    private int quantity; // Số lượng voucher
    
    @Column(name = "used-count")
    private int usedCount;

    @Column(name = "startDate")
    private LocalDateTime startDate;

    @Column(name = "endDate")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VoucherStatus status; // ACTIVE, EXPIRED, DISABLED
}
