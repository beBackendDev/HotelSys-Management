package com.thoaidev.bookinghotel.model.booking.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;

@Component
public class BookingMapper {

    public BookingDTO toDTO(Booking booking) {
        if (booking == null) return null;

        return BookingDTO.builder()
                .hotelId(booking.getHotel().getHotelId())
                .roomId(booking.getRoom().getRoomId())
                .checkinDate(booking.getCheckinDate())
                .checkoutDate(booking.getCheckoutDate())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .guestFullName(booking.getGuestFullName())
                .guestPhone(booking.getGuestPhone())
                .guestEmail(booking.getGuestEmail())
                .guestCccd(booking.getGuestCccd())
                .build();
    }

    public List<BookingDTO> toDTOList(List<Booking> bookings) {
        return bookings.stream().map(this::toDTO).toList();
    }

    // (Optional) toEntity nếu cần map ngược lại
}
