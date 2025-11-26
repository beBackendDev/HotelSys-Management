package com.thoaidev.bookinghotel.model.payment.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResponse;
import com.thoaidev.bookinghotel.model.payment.entity.Payment;
import com.thoaidev.bookinghotel.model.payment.mapper.PaymentMapper;
import com.thoaidev.bookinghotel.model.payment.repository.PaymentRepository;

@Service
public class PaymentSerImpl implements PaymentService{
    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    public PaymentDto getPaymentById(Integer id){
        Payment payment = paymentRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Payment not found."));
    
        return paymentMapper.toDto(payment);
    }
    @Override
    public PaymentResponse getAllPayments(int pageNo, int pageSize){
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1;
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Payment> payments = paymentRepo.findAll(pageable);

        List<PaymentDto> content = paymentMapper.toDTOList(payments.getContent());


        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setContent(content);
        paymentResponse.setPageNo(payments.getNumber());
        paymentResponse.setPageSize(payments.getSize());
        paymentResponse.setTotalElements(payments.getTotalElements());
        paymentResponse.setTotalPage(payments.getTotalPages());
        paymentResponse.setLast(payments.isLast());

        return paymentResponse;
    }
}