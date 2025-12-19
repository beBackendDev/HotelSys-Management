package com.thoaidev.bookinghotel.model.notification.enums;

public enum NotificationType {
    BOOKING_NEW, // Có booking mới
    BOOKING_CANCELLED, // Booking bị huỷ
    BOOKING_CHECKIN, // Khách check-in
    BOOKING_CHECKOUT, // Khách check-out
    PAYMENT_SUCCESS, // Thanh toán thành công
    PAYMENT_FAILED, // Thanh toán thất bại
    SYSTEM
}
