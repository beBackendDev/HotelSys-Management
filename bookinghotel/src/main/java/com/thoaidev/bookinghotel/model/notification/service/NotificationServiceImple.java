package com.thoaidev.bookinghotel.model.notification.service;

import java.util.List;

import javax.management.Notification;

import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.notification.dto.NotificationDTO;
import com.thoaidev.bookinghotel.model.notification.entity.Notifications;
import com.thoaidev.bookinghotel.model.notification.enums.NotificationType;
import com.thoaidev.bookinghotel.model.notification.mapper.NotificationMapper;
import com.thoaidev.bookinghotel.model.notification.repository.NotificationRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor

public class NotificationServiceImple implements NotificationService {

    private final NotificationRepository repo;
    private final NotificationMapper notificationMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyOwnerNewBooking(Integer ownerId, Booking booking) {
        Notifications notification = new Notifications();
        notification.setOwnerId(ownerId);
        notification.setType(NotificationType.BOOKING_NEW);
        notification.setTitle("Có booking mới");
        notification.setContent(
                "Phòng " + booking.getRoom().getRoomName()
                + " - " + booking.getHotel().getHotelName()
        );
        notification.setRefId(booking.getBookingId());
        notification.setIsRead(false);
        Notifications saved = repo.save(notification);

        NotificationDTO dto = notificationMapper.mapToDTO(saved);

        messagingTemplate.convertAndSendToUser(
                ownerId.toString(),
                "/queue/notifications",
                dto
        );

    }

    @Override
    public List<NotificationDTO> getNotifications(
            Integer ownerId
    ) {
        List<Notifications> notifications
                = repo.getNotifications(ownerId);

        return notifications
                .stream()
                .map(notificationMapper::mapToDTO)
                .toList();
    }

}
