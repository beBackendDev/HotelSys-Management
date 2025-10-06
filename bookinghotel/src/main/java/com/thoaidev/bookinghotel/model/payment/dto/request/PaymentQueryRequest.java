package com.thoaidev.bookinghotel.model.payment.dto.request;

import lombok.Data;

@Data
public class PaymentQueryRequest {
    private String orderId;      // vnp_TxnRef
    private String transDate;    // vnp_TransactionDate (format: yyyyMMddHHmmss)
} 
