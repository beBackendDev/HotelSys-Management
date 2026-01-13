package com.thoaidev.bookinghotel.model.payment.dto.request;

import java.math.BigDecimal;

import com.thoaidev.bookinghotel.model.enums.PaymentMethod;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MockPaymentCallbackRequest {
    private String transactionId;
    private Integer bookingId;
    private String responseCode; // "00" success
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
}
