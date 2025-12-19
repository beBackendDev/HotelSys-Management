package com.thoaidev.bookinghotel.model.notification.service;

import java.util.List;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.notification.dto.NotificationDTO;

public interface NotificationService {
    public void notifyOwnerNewBooking(
            Integer ownerId,
            Booking booking
    );
    public List<NotificationDTO> getNotifications(
            Integer ownerId
    );
}
