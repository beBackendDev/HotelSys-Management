package com.thoaidev.bookinghotel.model.notification.dto;

import java.time.LocalDateTime;

import com.thoaidev.bookinghotel.model.notification.enums.NotificationType;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NotificationDTO {
    private Integer notifyId;
    private NotificationType type;
    private String title;
    private String content;
    private Integer refId; // bookingId
    private Boolean isRead;
 private LocalDateTime createdAt;
}
