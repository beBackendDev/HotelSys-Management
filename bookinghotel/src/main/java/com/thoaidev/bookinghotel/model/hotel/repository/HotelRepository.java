package com.thoaidev.bookinghotel.model.hotel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer>, JpaSpecificationExecutor<Hotel> {

    public List<Hotel> findByHotelAddressContainingIgnoreCase(String location);

    public List<Hotel> findByHotelNameContainingIgnoreCase(String name);

    

}
