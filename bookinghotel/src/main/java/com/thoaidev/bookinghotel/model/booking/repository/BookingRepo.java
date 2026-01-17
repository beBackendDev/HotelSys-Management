package com.thoaidev.bookinghotel.model.booking.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.enums.BookingStatus;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.summary.admin.TrendingHotelProjection;
import com.thoaidev.bookinghotel.summary.owner.TrendingRoomProjection;

public interface BookingRepo extends JpaRepository<Booking, Integer> {

    //Kiểm tra Booking theo ngày checkin
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

    @Query("""
        SELECT b FROM Booking b 
        WHERE b.room.hotel.hotelId IN :hotelIds
        ORDER BY b.bookingId DESC
""")
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

    //Query booking with hotelId
    @Query("SELECT b FROM Booking b "
            + "WHERE b.hotel.hotelId = :hotelId ")
    List<Booking> findBookingByHotelId(
            @Param("hotelId") Integer hotelId);

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
    @Query("""
    SELECT b FROM Booking b
    WHERE b.hotel.hotelId = :hotelId
      AND b.room.roomId = :roomId
      AND b.status IN ('PENDING_PAYMENT', 'PAID')
      AND (:startDate <= b.checkoutDate AND :endDate >= b.checkinDate)
""")
    List<Booking> findConflictingBookings(
            @Param("hotelId") Integer hotelId,
            @Param("roomId") Integer roomId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Tìm các booking đã quá hạn chưa thanh toán
    @Query("SELECT b FROM Booking b  JOIN FETCH b.room WHERE b.status  = 'PENDING_PAYMENT' AND b.createdAt< :expiredTime")
    List<Booking> findExpiredBookings(@Param("expiredTime") LocalDateTime expiredTime);

    // Hủy các booking đã quá hạn
    @Modifying
    @Query("""
    UPDATE Booking b
    SET b.status = :cancelled
    WHERE b.status = :pending
    AND b.createdAt < :expiryTime
    """)
    int cancelExpiredBookings(
            @Param("pending") BookingStatus pending,
            @Param("cancelled") BookingStatus cancelled,
            @Param("expiryTime") LocalDateTime expiryTime
    );

    //Tìm booking tới hạn checkout
    @Query("SELECT b FROM Booking b JOIN FETCH b.room WHERE b.status = 'PAID' AND DATE(b.checkoutDate) <= :today")
    List<Booking> findBookingsToRelease(@Param("today") LocalDate today);

    @Query("SELECT b FROM Booking b JOIN FETCH b.room WHERE b.status = 'PAID' AND DATE(b.checkinDate) >= :today")
    List<Booking> findBookingsToday(@Param("today") LocalDate today);

//DASHBOARD tính tổng booking
    @Query("""
        SELECT COUNT(b.bookingId)
        FROM Booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND MONTH(b.createdAt) = :month
        AND YEAR(b.createdAt) = :year
""")
    Integer countBookings(Integer ownerId, Integer month, Integer year);

    @Query("""
        SELECT COUNT(b.bookingId)
        FROM Booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND r.roomId = :roomId
        AND MONTH(b.createdAt) = :month
        AND YEAR(b.createdAt) = :year
""")
    Integer countBookings(Integer ownerId, Integer roomId, Integer month, Integer year);
//DASHBOARD tính tổng booking bị hủy

    @Query("""
        SELECT COUNT(b.bookingId)
        FROM Booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND b.status = 'CANCELLED'
        AND MONTH(b.createdAt) = :month
        AND YEAR(b.createdAt) = :year
""")
    Integer countCancelledBookings(Integer ownerId, Integer month, Integer year);

//DASHBOARD tính tổng số ngày đã được book
    @Query("""
        SELECT COALESCE(SUM(DATEDIFF(b.checkoutDate, b.checkinDate)), 0)
        FROM Booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND b.status IN ('PAID', 'COMPLETED')
        AND MONTH(b.checkinDate) = :month
        AND YEAR(b.checkinDate) = :year
""")
    int getBookedRoomDays(Integer ownerId, Integer month, Integer year);

    @Query("""
        SELECT COALESCE(SUM(DATEDIFF(b.checkoutDate, b.checkinDate)), 0)
        FROM Booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND r.roomId = :roomId
        AND b.status IN ('PAID', 'COMPLETED')
        AND MONTH(b.checkinDate) = :month
        AND YEAR(b.checkinDate) = :year
""")
    int getBookedRoomDays(Integer ownerId, Integer roomId, Integer month, Integer year);
//DASHBOARD thực hiện tính các booking đang hoạt động

    @Query("""
        SELECT b FROM Booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND b.checkinDate <= :today
        AND b.checkoutDate >= :today
    """)
    Page<Booking> findRecentBookings(
            @Param("ownerId") Integer ownerId,
            @Param("today") LocalDate today,
            Pageable pageable
    );

//DASHBOARD timf trending room để tao BXH
//Sử dụng GroupBy để thực hiện nhóm theo từng attribute cụ thể và dùng hàm COUNT để tính tổng booking
//Sử dụng ORDER BY thực hiện sắp xếp
    @Query("""
    SELECT
        r.roomId AS roomId,
        r.roomName AS roomName,
        h.hotelName AS hotelName,
        COUNT(b) AS bookingCount,
        SUM(FUNCTION('datediff', b.checkoutDate, b.checkinDate)) AS bookedNights,
        SUM(b.totalPrice) AS revenue
    FROM Booking b
    JOIN b.room r
    JOIN r.hotel h
    WHERE h.owner.userId = :ownerId
      AND b.status IN ('PAID', 'COMPLETED')
      AND MONTH(b.checkinDate) = :month
      AND YEAR(b.checkinDate) = :year
    GROUP BY r.roomId, r.roomName, h.hotelName
    ORDER BY COUNT(b) DESC
""")
    List<TrendingRoomProjection> findTrendingRoom(
            @Param("ownerId") Integer ownerId,
            @Param("month") Integer month,
            @Param("year") Integer year,
            Pageable pageable
    );

    //Dashboard admin
    // Thêm vào BookingRepo interface
    @Query("SELECT COUNT(b.bookingId) FROM Booking b WHERE YEAR(b.checkinDate) = :year AND MONTH(b.checkinDate) = :month")
    Long countBookingsAllHotels(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COUNT(b.bookingId) FROM Booking b WHERE b.status = 'CANCELLED' AND YEAR(b.checkinDate) = :year AND MONTH(b.checkinDate) = :month")
    Long countCancelledBookingsAllHotels(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COALESCE(SUM(DATEDIFF(b.checkoutDate, b.checkinDate)), 0) FROM Booking b WHERE YEAR(b.checkinDate) = :year AND MONTH(b.checkinDate) = :month")
    Long getBookedRoomDaysAllHotels(@Param("year") int year, @Param("month") int month);

    @Query(value = """
    SELECT 
    h.hotel_id AS hotelId, 
    h.hotel_name AS hotelName, 
    u.full_name AS fullname, 
    COUNT(b.booking_id), 
           SUM(DATEDIFF(b.check_in_date, b.check_in_date)), 
           SUM(p.payment_amount)
    FROM Hotel h
    LEFT JOIN Room r ON h.hotel_id = r.hotel_id
    LEFT JOIN Booking b ON r.room_id = b.room_id
    LEFT JOIN Payment p ON b.booking_id = p.booking_id
    LEFT JOIN user u ON h.owner_id = u.user_id
    WHERE YEAR(b.check_in_date) = :year AND MONTH(b.check_in_date) = :month
    GROUP BY h.hotel_id
    ORDER BY COUNT(b.booking_id) DESC
    """, nativeQuery = true)
    List<TrendingHotelProjection> findTrendingHotel(
            @Param("year") int year,
            @Param("month") int month,
            Pageable pageable);
}
