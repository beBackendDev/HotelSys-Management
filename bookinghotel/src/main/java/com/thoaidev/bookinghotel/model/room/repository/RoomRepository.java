package com.thoaidev.bookinghotel.model.room.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thoaidev.bookinghotel.model.room.entity.Room;


public interface RoomRepository extends JpaRepository<Room, Integer>{
    List<Room> findByHotel_HotelId(Integer hotelId);
}
