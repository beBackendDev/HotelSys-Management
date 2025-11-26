package com.thoaidev.bookinghotel.model.payment.dto.response;

import java.util.List;

import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private List<PaymentDto> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPage;
    private boolean last;
}
