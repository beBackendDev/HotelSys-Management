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
}
