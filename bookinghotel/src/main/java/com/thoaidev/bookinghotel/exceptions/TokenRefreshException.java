package com.thoaidev.bookinghotel.exceptions;

public class TokenRefreshException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public TokenRefreshException(String token, String message) {
        super(String.format("Token [%s] : %s", token, message));
    }
}
