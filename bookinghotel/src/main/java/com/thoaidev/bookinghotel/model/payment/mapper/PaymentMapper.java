package com.thoaidev.bookinghotel.model.payment.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.entity.Payment;

@Component
public class PaymentMapper {
    public PaymentDto toDto(Payment payment){
        if (payment == null) return null;

        return PaymentDto.builder()
            //validate
            .paymentId(payment.getPaymentId())
            .transactionId(payment.getTransactionId())
            .orderInfo(payment.getOrderInfo())
            .paymentMethod(payment.getPaymentMethod())
            .paymentAmount(payment.getPaymentAmount())
            .createdAt(payment.getCreatedAt())
            .status(payment.getStatus())
            .bookingId(payment.getBooking().getBookingId())

            .build();
    }
        public List<PaymentDto> toDTOList(List<Payment> payments) {
            return payments.stream().map(this::toDto).toList();
    }
}
