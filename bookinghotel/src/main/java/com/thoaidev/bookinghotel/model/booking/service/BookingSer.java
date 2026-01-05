package com.thoaidev.bookinghotel.model.booking.service;

import java.time.LocalDate;
import java.util.List;

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.dto.response.BookingResponse;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

public interface BookingSer {

    BookingResponse getBookingOfOwner(Integer ownerId, int pageNo, int pageSize);

    public BookingDTO getBookingById(Integer id);

    public BookingResponse getRecentBookings(Integer ownerId, int pageNo, int pageSize);

    public BookingResponse getBookingInDay(Integer ownerId, LocalDate day, int pageNo, int pageSize);

    public List<BookingDTO> getBookingByRoomId(Integer id, LocalDate today);

    public BookingResponse getAllBookings(Integer userId, int pageNo, int pageSize);

    public BookingResponse getAllBookings(int pageNo, int pageSize);

    public boolean isRoomAvailable(Integer roomId, LocalDate checkin, LocalDate checkout);// kiểm tra phòng có sẵn không hay đã được đặt( giữ chỗ)

    public void cancelExpiredBookings();//tự độngg kiểm tra xem booking nào đã hết hạn thanh toán( >15p)

    public Booking bookRoom(BookingDTO bookingDTO, UserEntity user);

    public void cancelBooking(Integer id);
//VALIDATE BOOKING 
    void confirmBooking(Integer bookingId);

}
