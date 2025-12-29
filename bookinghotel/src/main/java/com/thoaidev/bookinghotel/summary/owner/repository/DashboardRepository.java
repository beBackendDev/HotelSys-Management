package com.thoaidev.bookinghotel.summary.owner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;

@Repository
public interface DashboardRepository extends JpaRepository<Booking, Long> {

@Query(value = """
    SELECT 
      DATE(b.created_at) as date,
      COUNT(b.booking_id) as totalBooking,
      SUM(b.total_price) as totalRevenue
    FROM booking b
    WHERE 
      b.hotel_id IN :hotelIds
      AND YEAR(b.created_at) = :year
      AND MONTH(b.created_at) = :month
      AND b.status IN ('PAID', 'COMPLETED')
    GROUP BY DATE(b.created_at)
    ORDER BY DATE(b.created_at)
""", nativeQuery = true)
    List<Object[]> getDailyRevenue(
        @Param("hotelIds") List<Integer> hotelIds,
        @Param("year") Integer year,
        @Param("month") Integer month
    );
}

