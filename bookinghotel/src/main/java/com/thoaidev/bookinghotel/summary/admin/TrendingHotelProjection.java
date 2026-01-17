package com.thoaidev.bookinghotel.summary.admin;

public interface TrendingHotelProjection {

    Integer getHotelId();

    String getHotelName();

    String getOwnerName();

    Integer getBookingCount();

    Integer getBookedNights();

    Double getRevenue();

}
