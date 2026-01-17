package com.thoaidev.bookinghotel.model.payment.repository;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.payment.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByTransactionId(String txnRef);

    @Query("""
        SELECT p FROM Payment p 
        JOIN p.booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        ORDER BY p.createdAt DESC
    """)
    Page<Payment> findAllPaymentsForOwner(
            @Param("ownerId") Integer ownerId,
            Pageable pageable
    );
//Thực hiện hiển thị tổng doanh thu ở DASHBOARD

    @Query("""
        SELECT COALESCE(SUM(p.paymentAmount), 0)
        FROM Payment p
        JOIN p.booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND p.status = 'SUCCESS'
        AND MONTH(p.createdAt) = :month
        AND YEAR(p.createdAt) = :year
    """)
    BigDecimal getTotalRevenue(
            Integer ownerId,
            Integer month,
            Integer year
    );

    //admin
    @Query("""
        SELECT COALESCE(SUM(p.paymentAmount), 0)
        FROM Payment p
        JOIN p.booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE  p.status = 'SUCCESS'
        AND MONTH(p.createdAt) = :month
        AND YEAR(p.createdAt) = :year
    """)
    BigDecimal getTotalRevenueAllHotels(
            Integer month,
            Integer year
    );

    @Query("""
        SELECT COALESCE(SUM(p.paymentAmount), 0)
        FROM Payment p
        JOIN p.booking b
        JOIN b.room r
        JOIN r.hotel h
        WHERE h.owner.userId = :ownerId
        AND r.roomId = :roomId
        AND p.status = 'SUCCESS'
        AND MONTH(p.createdAt) = :month
        AND YEAR(p.createdAt) = :year
    """)
    BigDecimal getTotalRevenue(
            Integer ownerId,
            Integer roomId,
            Integer month,
            Integer year
    );

// Hoặc nếu dùng Object mapping, tạo interface projection:
    @Query(value = """
    SELECT 
        u.user_id as ownerId,
        u.full_name as ownerName,
        COUNT(DISTINCT h.hotel_id) as hotelCount,
        COUNT(DISTINCT r.room_id) as roomCount,
        SUM(p.payment_amount) as revenue,
        COUNT(b.booking_id) as bookingCount
    FROM users u
    INNER JOIN hotel h ON u.user_id = h.owner_id
    LEFT JOIN room r ON h.hotel_id = r.hotel_id
    LEFT JOIN booking b ON r.room_id = b.room_id
    LEFT JOIN payment p ON b.booking_id = p.booking_id
    WHERE YEAR(p.payment_date) = :year
    AND MONTH(p.payment_date) = :month
    GROUP BY u.user_id, u.fullname
    ORDER BY revenue DESC
    """, nativeQuery = true)
    Page<TopOwnerProjection> getTopOwnersByRevenueProjection(
            @Param("month") int month,
            @Param("year") int year,
            Pageable pageable
    );

// Interface projection
    public interface TopOwnerProjection {

        Integer getOwnerId();

        String getOwnerName();

        Integer getHotelCount();

        Integer getRoomCount();

        BigDecimal getRevenue();

        Integer getBookingCount();
    }
}
