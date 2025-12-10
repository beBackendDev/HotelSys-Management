package com.thoaidev.bookinghotel.model.room.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.room.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer>, JpaSpecificationExecutor<Room>{
    List<Room> findByHotel_HotelId(Integer hotelId);
}
