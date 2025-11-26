package com.thoaidev.bookinghotel.model.payment.service;

import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResponse;

public interface PaymentService {
    public PaymentDto getPaymentById(Integer id);
    public PaymentResponse getAllPayments(int pageNo, int pageSize);
}
