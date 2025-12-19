package com.thoaidev.bookinghotel.model.notification.dto;

import com.thoaidev.bookinghotel.model.notification.enums.NotificationType;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NotificationDTO {

    private NotificationType type;
    private String title;
    private String content;
    private Integer refId; // bookingId
}
