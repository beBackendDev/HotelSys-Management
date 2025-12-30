package com.thoaidev.bookinghotel.data.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.thoaidev.bookinghotel.model.enums.RoomStatus;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RoomSeedDto {

    private String roomName;
    private String roomType;
    private Integer roomOccupancy;
    private RoomStatus roomStatus;
    private BigDecimal roomPricePerNight;
    private LocalDate dateAvailable;

    private List<String> roomImageUrls = new ArrayList<>();;
    private List<FacilitySeedDto> facilities = new ArrayList<>();;
}
