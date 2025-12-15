package com.thoaidev.bookinghotel.summary.owner;

public interface TrendingRoomProjection {

    Integer getRoomId();
    String getRoomName();
    String getHotelName();

    Integer getBookingCount();
    Integer getBookedNights();
    Double getRevenue();
}
