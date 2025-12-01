package com.thoaidev.bookinghotel.model.hotel.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.common.HotelFacility;
import com.thoaidev.bookinghotel.model.common.HotelFacilityDTO;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.user.dto.OwnerDto;

@Component
public class HotelMapper {

    public HotelDto mapToHotelDto(Hotel hotel) {
        List<String> imageUrls = hotel.getHotelImages().stream()
                .map(Image::getUrl)
                .collect(Collectors.toList());

        List<HotelFacilityDTO> facilityDtos = Optional.ofNullable(hotel.getFacilities())
                .orElse(Collections.<HotelFacility>emptyList()) // ép kiểu cho emptyList
                .stream()
                .map((HotelFacility f) -> new HotelFacilityDTO(f.getId(), f.getIcon(), f.getName()))
                .collect(Collectors.toList());
        OwnerDto ownerDto = null;
        if(hotel.getOwner() != null){
            ownerDto = new OwnerDto(
                hotel.getOwner().getUsername(),
                hotel.getOwner().getFullname(),
                hotel.getOwner().getBusinessLicenseNumber(),
                hotel.getOwner().getExperienceInHospitality(),
                hotel.getOwner().getOwnerDescription()
            );
        }
                HotelDto hotelDto =  HotelDto
                .builder()
                .hotelId(hotel.getHotelId())
                .hotelName(hotel.getHotelName())
                .hotelImageUrls(imageUrls)
                .hotelAveragePrice(hotel.getHotelAveragePrice())
                .hotelFacilities(facilityDtos)
                .hotelStatus(hotel.getHotalStatus())
                .hotelAddress(hotel.getHotelAddress())
                .hotelContactMail(hotel.getHotelContactMail())
                .hotelContactPhone(hotel.getHotelContactPhone())
                .hotelDescription(hotel.getHotelDescription())
                .ratingPoint(hotel.getRatingPoint())
                .totalReview(hotel.getTotalReview())
                .hotelCreatedAt(hotel.getHotelCreatedAt())
                .hotelUpdatedAt(hotel.getHotelUpdatedAt())
                .ownerId(hotel.getOwner().getUserId())//thực hiện lấy id người dùng <=> id owner
                .owner(ownerDto)
                .build();
                
        return hotelDto;
    }

    // Map ngược lại từ DTO → Entity
    public Hotel mapToHotel(HotelDto dto) {
        Hotel hotel = new Hotel();
        hotel.setHotelId(dto.getHotelId());
        hotel.setHotelName(dto.getHotelName());
        hotel.setHotelAveragePrice(dto.getHotelAveragePrice());
        hotel.setHotelAddress(dto.getHotelAddress());
        hotel.setHotelContactMail(dto.getHotelContactMail());
        hotel.setHotelContactPhone(dto.getHotelContactPhone());
        hotel.setHotelDescription(dto.getHotelDescription());
        hotel.setRatingPoint(dto.getRatingPoint());
        hotel.setTotalReview(dto.getTotalReview());
        hotel.setHotalStatus(dto.getHotelStatus());
        hotel.setHotelCreatedAt(dto.getHotelCreatedAt());
        hotel.setHotelUpdatedAt(dto.getHotelUpdatedAt());

        // Nếu cần map facility DTO → entity
        if (dto.getHotelFacilities() != null) {
            List<HotelFacility> facilities = dto.getHotelFacilities().stream()
                    .map(f -> {
                    HotelFacility facility = new HotelFacility();
                    facility.setId(f.getId());
                    facility.setIcon(f.getIcon());
                    facility.setName(f.getName());
                    facility.setHotel(hotel);   //Quan trọng: set quan hệ ManyToOne
                    return facility;
                })
                    .collect(Collectors.toList());
            hotel.setFacilities(facilities);
        }

        return hotel;
    }
}
