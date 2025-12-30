package com.thoaidev.bookinghotel.data.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.thoaidev.bookinghotel.model.enums.HotelStatus;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class HotelSeedDto {

    private String hotelName;
    private String hotelAddress;
    private BigDecimal hotelAveragePrice;
    private HotelStatus hotelStatus;
    private String hotelContactMail;
    private String hotelContactPhone;
    private String hotelDescription;

    private Double ratingPoint;
    private Integer totalReview;
    private Integer ownerId;

    private List<FacilitySeedDto> hotelFacilities= new ArrayList<>();;
    private List<String> hotelImageUrls = new ArrayList<>();;
    private List<RoomSeedDto> rooms = new ArrayList<>();;
}

