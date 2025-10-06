package com.thoaidev.bookinghotel.model.booking.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.thoaidev.bookinghotel.model.enums.BookingStatus;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "booking")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;

    @Column(name = "check_in_date")
    private LocalDate checkinDate;

    @Column(name = "check_out_date")
    private LocalDate checkoutDate;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    //thông tin người đặt
    @Column(name = "guest_full_name")
    private String guestFullName;

    @Column(name = "guest_phone")
    private String guestPhone;

    @Column(name = "guest_email")
    private String guestEmail;
    
    @Column(name = "guest_cccd")
    private String guestCccd;

}
