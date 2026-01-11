package com.thoaidev.bookinghotel.model.voucher.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thoaidev.bookinghotel.model.voucher.dto.VoucherValidateRequest;
import com.thoaidev.bookinghotel.model.voucher.dto.VoucherValidateResponse;
import com.thoaidev.bookinghotel.model.voucher.service.VoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @PostMapping("/public/validate-voucher")
    public ResponseEntity<?> validateVoucher(
            @RequestBody VoucherValidateRequest request
    ) {
        VoucherValidateResponse response =
                voucherService.validateVoucher(request);

        return ResponseEntity.ok(response);
    }
}
