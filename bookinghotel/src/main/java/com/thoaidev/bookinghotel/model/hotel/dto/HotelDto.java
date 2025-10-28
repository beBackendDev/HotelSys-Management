package com.thoaidev.bookinghotel.model.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import com.thoaidev.bookinghotel.model.common.HotelFacilityDTO;
import com.thoaidev.bookinghotel.model.enums.HotelStatus;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReview;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HotelDto {

    private Integer hotelId;//Id khach san
    private String hotelName;//ten khach san
    private String hotelAddress;//dia chi khach san

    private BigDecimal hotelAveragePrice;//gia tien trung binh
    private List<HotelFacilityDTO> hotelFacilities;//tien ich
    private List<HotelReview> reviews;//danh gia
    private Double ratingPoint;
    private Integer totalReview;//danh gia
    private HotelStatus hotelStatus;
    private String hotelContactMail;//Email lien he
    private String hotelContactPhone;//Phone lien he
    private String hotelDescription;//mo ta khách san
    private List<String> hotelImageUrls;//hinh anh khách san
    private LocalDateTime hotelCreatedAt;//ngay tao
    private LocalDateTime hotelUpdatedAt;//ngay duoc nang cap

    public List<String> getHotelImageUrls() {
        return hotelImageUrls != null ? hotelImageUrls : Collections.emptyList();

    }

    private Integer ownerId;
}
