package com.thoaidev.bookinghotel.model.payment.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MockInitPaymentResponse{
        String paymentUrl;
        String transactionId;
        LocalDateTime createdAt;
}
