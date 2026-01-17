package com.thoaidev.bookinghotel.model.room.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.common.RoomFacility;
import com.thoaidev.bookinghotel.model.common.RoomFacilityDTO;
import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.entity.Room;

@Component
public class RoomMapper {
    public RoomDto mapToRoomDTO(Room room) {
        List<String> imageUrls = room.getRoomImages().stream()
                .map(Image::getUrl)
                .collect(Collectors.toList());

        List<RoomFacilityDTO> facilityDtos = Optional.ofNullable(room.getFacilities())
                .orElse(Collections.<RoomFacility>emptyList()) // ép kiểu cho emptyList
                .stream()
                .map((RoomFacility f) -> new RoomFacilityDTO(f.getId(), f.getIcon(), f.getName()))
                .collect(Collectors.toList());

                RoomDto roomDto =  RoomDto
                .builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .roomImageUrls(imageUrls)
                .roomType(room.getRoomType())
                .roomFacilities(facilityDtos)
                .roomOccupancy(room.getRoomOccupancy())
                .dateAvailable(room.getDateAvailable())
                .roomStatus(room.getRoomStatus())
                //
                .roomPricePerNight(room.getRoomPricePerNight())
                .finalPrice(room.getFinalPrice())
                .discountPercent(room.getDiscountPercent())
                .discountType(room.getDiscountType())
                .discountStart(room.getDiscountStart())
                .discountEnd(room.getDiscountEnd())
                .active(room.isActive())
                //
                .hotelId(room.getHotel().getHotelId())//thực hiện lấy id HOtel
                .hotelName(room.getHotel().getHotelName())//thực hiện lấy id HOtel
                .build();
                
        return roomDto;
    }
}
