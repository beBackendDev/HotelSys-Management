package com.thoaidev.bookinghotel.model.hotel.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.model.hotel.FilterRequest;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.dto.response.HotelResponse;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

public interface HotelService {

    //xu li thuc hien lay du lieu trong database de dien vao thymeleaf
//GET methods
    HotelResponse getAllHotels(int pageNo, int pageSize);

    // HotelResponse filterHotels(FilterRequest fiter);
    public HotelDto getHotelById(Integer id);

    public List<Hotel> getHotelsByAddress(String location);

    public List<Hotel> getHotelsByName(String name);

    public HotelResponse getAllHotels(FilterRequest filter);

    //Get in rapidApi
    public List<HotelDto> fetchHotelsFromRapidAPI(LocalDate checkin, LocalDate checkout);
//POST methods

    public HotelDto createHotel(HotelDto hotelDto);

    public List<String> imgUpload(Integer roomId, List<MultipartFile> files, String hotelName);
    //PUT methods

    public HotelDto updateHotel(HotelDto hotelDto, Integer id);
//DELETE methods

    public void deleteHotelById(Integer id);
}
