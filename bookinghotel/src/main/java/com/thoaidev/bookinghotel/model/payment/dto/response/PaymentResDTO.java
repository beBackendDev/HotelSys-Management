package com.thoaidev.bookinghotel.model.payment.dto.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResDTO implements Serializable{
    private Integer bookingId;
    private int amount;
    // private String paymentStatus;
    private String paymentMessage;
    private String paymentURL;
}
