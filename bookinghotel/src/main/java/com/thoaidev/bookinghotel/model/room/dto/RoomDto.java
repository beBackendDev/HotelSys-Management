package com.thoaidev.bookinghotel.model.room.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import com.thoaidev.bookinghotel.model.common.RoomFacilityDTO;
import com.thoaidev.bookinghotel.model.enums.RoomStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RoomDto {

    private Integer roomId;
    private String roomName;
    private List<String> roomImageUrls;
    private String roomType;
    private Integer roomOccupancy;
    private LocalDate dateAvailable;
    private RoomStatus roomStatus;
    private BigDecimal roomPricePerNight;
    private List<RoomFacilityDTO> roomFacilities;
    // private Hotel hotel;
    private Integer hotelId;// chỉ cần lấy hotelId trong Dto để truy vấn


}
