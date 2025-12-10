package com.thoaidev.bookinghotel.model.room.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;


import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.entity.Room;
@Component
public class RoomMapper {
    public RoomDto mapToRoomDTO(Room room) {
        List<String> imageUrls = room.getRoomImages().stream()
                .map(Image::getUrl)
                .collect(Collectors.toList());

        // List<RoomFacility> facilityDtos = Optional.ofNullable(room.getFacilities())
        //         .orElse(Collections.<RoomFacility>emptyList()) // ép kiểu cho emptyList
        //         .stream()
        //         .map((RoomFacility f) -> new RoomFacilityDTO(f.getId(), f.getIcon(), f.getName()))
        //         .collect(Collectors.toList());
        // OwnerDto ownerDto = null;
        // if(hotel.getOwner() != null){
        //     ownerDto = new OwnerDto(
        //         hotel.getOwner().getUsername(),
        //         hotel.getOwner().getFullname(),
        //         hotel.getOwner().getBusinessLicenseNumber(),
        //         hotel.getOwner().getExperienceInHospitality(),
        //         hotel.getOwner().getOwnerDescription()
        //     );
        // }
                RoomDto roomDto =  RoomDto
                .builder()
                .roomId(room.getRoomId())
                .roomName(room.getRoomName())
                .roomImageUrls(imageUrls)
                .roomType(room.getRoomType())
                // .hotelFacilities(facilityDtos)
                .roomOccupancy(room.getRoomOccupancy())
                .dateAvailable(room.getDateAvailable())
                .roomStatus(room.getRoomStatus())
                .roomPricePerNight(room.getRoomPricePerNight())
                
                .hotelId(room.getHotel().getHotelId())//thực hiện lấy id HOtel
                // .owner(ownerDto)
                .build();
                
        return roomDto;
    }
}
