package com.thoaidev.bookinghotel.model.booking.mapper;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.enums.BookingStatus;

@Component
public class BookingMapper {
    public BookingDTO toDTO(Booking booking) {
        if (booking == null) return null;
        //Thực hiện kiểm tra xem tính khả thi của người dùng khi đánh giá:
        // ?COMPLETED
        //?checkout>14days until now
        boolean canReview = booking.getStatus() == BookingStatus.COMPLETED
                            && LocalDate.now().isBefore(booking.getCheckoutDate().plusDays(14));
                            System.out.println("Validate Review: "+ canReview);
        return BookingDTO.builder()
                //Validate review
                .canReview(canReview)
                .bookingId(booking.getBookingId())
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
