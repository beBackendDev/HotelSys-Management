package com.thoaidev.bookinghotel.model.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.thoaidev.bookinghotel.model.enums.PaymentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentDto {
    private Integer paymentId;
    private String transactionId;
    private String orderInfo;
    private String paymentMethod;
    private BigDecimal paymentAmount;
    private LocalDateTime createdAt;
    private PaymentStatus status;
    private Integer bookingId;
}
