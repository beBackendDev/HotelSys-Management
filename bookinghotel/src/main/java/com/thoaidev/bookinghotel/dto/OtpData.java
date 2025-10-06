package com.thoaidev.bookinghotel.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class OtpData {
    private String email;
    private String otpCode;
    private LocalDateTime expirationTime;

    
    public OtpData(String otpCode, LocalDateTime expirationTime) {
        this.otpCode = otpCode;
        this.expirationTime = expirationTime;
    }
    
}
