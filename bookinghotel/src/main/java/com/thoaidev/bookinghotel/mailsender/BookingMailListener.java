package com.thoaidev.bookinghotel.mailsender;

import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.booking.dto.BookingConfirmedEvent;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.mapper.BookingMapper;
import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingMailListener {

    private final UserService service;
    private final BookingRepo bookingRepository;
    private final BookingMapper bookingMapper;

    @Async
    @EventListener
    public void handleBookingConfirmed(BookingConfirmedEvent event) {

        Booking booking = bookingRepository
                .findById(event.bookingId())
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        service.sendBookingInformation(
                booking.getGuestEmail(),
                bookingMapper.toDTO(booking)
        );
    }
}

