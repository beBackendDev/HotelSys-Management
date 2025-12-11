package com.thoaidev.bookinghotel.model.booking.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

public interface BookingRepo extends JpaRepository<Booking, Integer> {

    @Query("""
    SELECT b FROM Booking b
    JOIN b.room r
    JOIN r.hotel h
    WHERE h.owner.userId = :ownerId
      AND b.checkinDate >= :start
      AND b.checkinDate < :end
        """)
    Page<Booking> findBookingsByOwnerAndDate(
            @Param("ownerId") Integer ownerId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable
    );

    //Tìm kiếm booking dựa trên userId
    Page<Booking> findByUser(UserEntity user, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.room.hotel.hotelId IN :hotelIds")
    Page<Booking> findAllByHotelIds(List<Integer> hotelIds, Pageable pageable);

    @Query("SELECT b FROM Booking b  JOIN FETCH b.room WHERE b.room.roomId  = :roomId AND b.checkinDate >= :today AND b.status = 'PAID' ")
    Page<Booking> findByOwner(UserEntity user, Pageable pageable);

    @Query("SELECT b FROM Booking b "
            + "JOIN FETCH b.room "
            + "WHERE b.room.roomId  = :roomId "
            + "AND b.checkinDate >= :today "
            + "AND b.status = 'PAID' ")
    List<Booking> findByRoomId(@Param("roomId") Integer roomId, @Param("today") LocalDate today
    );

    //kiểm tra tính khả thi khi viết Review của người dùng
    @Query("SELECT b FROM Booking b "
            + "WHERE b.user.userId = :userId "
            + "AND b.hotel.hotelId = :hotelId "
            + "AND (b.status = 'PAID' or  b.status = 'COMPLETED')"
            + "AND b.checkoutDate < :currentDate")
    List<Booking> findEligibleBookingsForReview(
            @Param("userId") Integer userId,
            @Param("hotelId") Integer hotelId,
            @Param("currentDate") LocalDate currentDate);

    // Kiểm tra trùng lịch
    @Query("SELECT b FROM Booking b WHERE b.room.roomId = :roomId "
            + "AND b.status IN ('PENDING_PAYMENT', 'PAID') "
            + "AND (:startDate <= b.checkoutDate AND :endDate >= b.checkinDate)")
    List<Booking> findConflictingBookings(@Param("roomId") Integer roomId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Tìm các booking đã quá hạn chưa thanh toán
    @Query("SELECT b FROM Booking b  JOIN FETCH b.room WHERE b.status  = 'PENDING_PAYMENT' AND b.createdAt< :expiredTime")
    List<Booking> findExpiredBookings(@Param("expiredTime") LocalDateTime expiredTime);

    //Tìm booking tới hạn checkout
    @Query("SELECT b FROM Booking b JOIN FETCH b.room WHERE b.status = 'PAID' AND DATE(b.checkoutDate) <= :today")
    List<Booking> findBookingsToRelease(@Param("today") LocalDate today);

    @Query("SELECT b FROM Booking b JOIN FETCH b.room WHERE b.status = 'PAID' AND DATE(b.checkinDate) >= :today")
    List<Booking> findBookingsToday(@Param("today") LocalDate today);
}
