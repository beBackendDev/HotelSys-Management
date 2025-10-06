package com.thoaidev.bookinghotel.model.user.dto;

import java.time.LocalDate;
import java.util.List;

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {

    private Integer userId;

    private String username;

    private String password;

    private String fullname;

    private String roleName;

    private String phone;

    private String urlImg;

    private Boolean gender;

    private LocalDate birthday;

    private List<BookingDTO> bookings;// Lay danh sach Booking

    private List<HotelReviewDTO> reviews;// Lay danh sach Review

}
