package com.thoaidev.bookinghotel.model.notification.mapper;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.notification.dto.NotificationDTO;
import com.thoaidev.bookinghotel.model.notification.entity.Notifications;


import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class NotificationMapper {

    public NotificationDTO mapToDTO(Notifications notification) {
        NotificationDTO notificationDTO = NotificationDTO
                .builder()
                .notifyId(notification.getNotifyId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .type(notification.getType())
                .title(notification.getTitle())
                .content(notification.getContent())
                .refId(notification.getRefId())
                .build();
        return notificationDTO;
    }

}
