package com.thoaidev.bookinghotel.model.payment.repository;

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
}
