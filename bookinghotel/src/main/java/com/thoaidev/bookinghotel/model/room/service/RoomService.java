package com.thoaidev.bookinghotel.model.room.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.model.room.dto.RoomDto;

public interface RoomService {
//GET methods
    List <RoomDto> getRoomByHotelId(Integer id);
    RoomDto getRoomById(Integer roomId, Integer hotelId);
//POST methods
    RoomDto createRoom (Integer hotelId, RoomDto roomDto);
//PUT methods
    RoomDto updateRoom (Integer hotelId, Integer roomId, RoomDto roomDto);
//DELETE methods
    void deleteRoombyId(Integer hotelId, Integer roomId);
    List<String> imgUpload(Integer roomId, List<MultipartFile> file, String hotelName);
}
