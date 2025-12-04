package com.thoaidev.bookinghotel.model.payment.service;

import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.dto.request.PaymentInitRequest;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResponse;

public interface PaymentService {
    public int payByCash (PaymentInitRequest paymentRq);
    public PaymentDto getPaymentById(Integer id);
    public PaymentResponse getAllPayments(int pageNo, int pageSize);
}
