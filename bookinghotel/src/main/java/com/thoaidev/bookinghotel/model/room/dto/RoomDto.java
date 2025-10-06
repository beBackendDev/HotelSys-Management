package com.thoaidev.bookinghotel.model.room.dto;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import com.thoaidev.bookinghotel.model.enums.RoomStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoomDto {
        private Integer roomId; 
        private String roomName;
        private List<String> roomImageUrls;
        private String roomType;
        private Integer roomOccupancy;
        private RoomStatus roomStatus;
        private BigDecimal roomPricePerNight;

    // private Hotel hotel;
        private Integer hotelId;// chỉ cần lấy hotelId trong Dto để truy vấn

        
        public List<String> getRoomImageUrls() {
    return roomImageUrls != null ? roomImageUrls : Collections.emptyList();
}

}
