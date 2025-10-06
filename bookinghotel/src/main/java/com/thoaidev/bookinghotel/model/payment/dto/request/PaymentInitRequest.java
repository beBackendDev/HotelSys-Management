package com.thoaidev.bookinghotel.model.payment.dto.request;

import lombok.Data;

@Data
public class PaymentInitRequest {
    private Integer bookingId;
    private int amount;
    private String orderInfo;
}
