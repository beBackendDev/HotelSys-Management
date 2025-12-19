package com.thoaidev.bookinghotel.model.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thoaidev.bookinghotel.model.notification.entity.Notifications;

public interface NotificationRepository extends JpaRepository<Notifications, Integer> {
    @Query("""
            SELECT n FROM Notifications n
            WHERE n.ownerId = :ownerId
            ORDER BY n.createdAt DESC
            """)
    List<Notifications> getNotifications(@Param("ownerId") Integer ownerId);

    Integer countByOwnerIdAndIsReadFalse(Integer ownerId);
}
