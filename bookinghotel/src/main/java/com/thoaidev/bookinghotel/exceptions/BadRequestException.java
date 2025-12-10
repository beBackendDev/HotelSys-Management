package com.thoaidev.bookinghotel.exceptions;

public class BadRequestException extends RuntimeException {
     public BadRequestException(String message) {
        super(message);
    }
}
