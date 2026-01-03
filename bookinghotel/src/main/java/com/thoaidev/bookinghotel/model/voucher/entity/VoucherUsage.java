package com.thoaidev.bookinghotel.model.voucher.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Setter;
import lombok.Getter;

@Entity
@Table(name = "voucher_usage",
        uniqueConstraints = @UniqueConstraint(columnNames = {"voucher_id", "booking_id"}))
@Getter
@Setter
public class VoucherUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "used_at")
    private LocalDateTime usedAt;
}
