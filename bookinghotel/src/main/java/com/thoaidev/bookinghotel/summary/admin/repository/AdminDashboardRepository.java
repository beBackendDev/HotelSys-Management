package com.thoaidev.bookinghotel.summary.admin.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;

@Repository
public interface AdminDashboardRepository extends JpaRepository<Booking, Integer> {

    /**
     * Lấy doanh thu hàng ngày từ tất cả khách sạn
     */
    @Query(value = """
        SELECT 
            p.created_at,
            COUNT(b.booking_id) as booking_count,
            SUM(p.payment_amount) as total_revenue
        FROM payment p
        LEFT JOIN booking b ON p.booking_id = b.booking_id
        WHERE YEAR(p.created_at) = :year 
        AND MONTH(p.created_at) = :month
        GROUP BY p.created_at
        ORDER BY p.created_at ASC
        """, nativeQuery = true)
    List<Object[]> getDailyRevenueAllHotels(
            @Param("year") int year,
            @Param("month") int month
    );

    /**
     * Lấy thống kê booking theo khách sạn
     */
    @Query(value = """
        SELECT 
            h.hotel_id,
            h.hotel_name,
            COUNT(b.booking_id) as booking_count,
            SUM(DATEDIFF(b.check_out_date, b.check_in_date)) as booked_nights,
            SUM(p.amount) as total_revenue
        FROM Hotel h
        LEFT JOIN rooms r ON h.hotel_id = r.hotel_id
        LEFT JOIN bookings b ON r.room_id = b.room_id
        LEFT JOIN payments p ON b.booking_id = p.booking_id
        WHERE YEAR(b.check_in_date) = :year 
        AND MONTH(b.check_in_date) = :month
        GROUP BY h.hotel_id
        ORDER BY total_revenue DESC
        """, nativeQuery = true)
    List<Object[]> getTrendingHotelsRaw(
            @Param("year") int year,
            @Param("month") int month
    );
}