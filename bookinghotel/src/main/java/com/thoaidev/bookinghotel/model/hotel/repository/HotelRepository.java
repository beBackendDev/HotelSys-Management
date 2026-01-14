package com.thoaidev.bookinghotel.model.hotel.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Integer>, JpaSpecificationExecutor<Hotel> {

    public List<Hotel> findByHotelAddressContainingIgnoreCase(String location);

    public List<Hotel> findByHotelNameContainingIgnoreCase(String name);

    @Query("""
        SELECT h FROM Hotel h
        WHERE h.owner.userId = :ownerId
        ORDER BY h.hotelCreatedAt DESC
    """)
    public Page<Hotel> findByOwner_UserId(
            @Param("ownerId") Integer ownerId,
            Pageable pageable);

            //Get all wwith active hotel
    @Query("""
        SELECT h FROM Hotel h
        WHERE h.hotelStatus = 'ACTIVE'
    """)
    public Page<Hotel> findActiveHotel(
            Pageable pageable);




    public List<Hotel> findAllByOwner_UserId(Integer ownerId);
    //DASHBOARD tính tổng số khách sạn của Owner

    @Query("""
        SELECT COUNT(h.hotelId)
        FROM Hotel h
        WHERE h.owner.userId = :ownerId
""")
    Integer countHotels(Integer ownerId);

    @Query("""
        SELECT h.hotelId
        FROM Hotel h
        WHERE h.owner.userId = :ownerId
    """)
    List<Integer> findHotelIdsByOwnerId(@Param("ownerId") Integer ownerId);

}
