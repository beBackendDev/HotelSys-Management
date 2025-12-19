package com.thoaidev.bookinghotel.model.payment.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "transaction_id")
    private String transactionId;// <-- Mã này bạn sinh ra, gửi cho VNPay chính là vnpTxnRef

    @Column(name = "order_info")
    private String orderInfo;

    // @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    // private PaymentMethod paymentMethod; // VNPay, Momo, etc.
    private String paymentMethod;

    @Column(name = "payment_amount")
    private BigDecimal paymentAmount;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;// PAID |  | PENDING
    

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
