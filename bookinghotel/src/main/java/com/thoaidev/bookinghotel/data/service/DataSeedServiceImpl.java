package com.thoaidev.bookinghotel.data.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.thoaidev.bookinghotel.data.dto.HotelSeedDto;
import com.thoaidev.bookinghotel.data.dto.RoomSeedDto;
import com.thoaidev.bookinghotel.model.common.HotelFacility;
import com.thoaidev.bookinghotel.model.common.RoomFacility;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DataSeedServiceImpl implements DataSeedService {

    private final ObjectMapper objectMapper;
    private final HotelRepository hotelRepo;
    private final UserRepository userRepo;

    @Transactional
    public void importSeedData() throws IOException {

        InputStream isHotel = new ClassPathResource("data/seed/hotels.json").getInputStream();
        List<HotelSeedDto> hotels = objectMapper.readValue(
                isHotel,
                new TypeReference<List<HotelSeedDto>>() {}
        );
        InputStream isRoom = new ClassPathResource("data/seed/rooms.json").getInputStream();
        List<RoomSeedDto> rooms = objectMapper.readValue(
                isRoom,
                new TypeReference<List<RoomSeedDto>>() {}
        );

        for (HotelSeedDto h : hotels) {

            Hotel hotel = new Hotel();
            hotel.setHotelName(h.getHotelName());
            hotel.setHotelAddress(h.getHotelAddress());
            hotel.setHotelAveragePrice(h.getHotelAveragePrice());
            hotel.setHotelDescription(h.getHotelDescription());
            hotel.setHotelContactMail(h.getHotelContactMail());
            hotel.setHotelContactPhone(h.getHotelContactPhone());
            hotel.setHotalStatus(h.getHotelStatus());
            hotel.setRatingPoint(h.getRatingPoint());
            hotel.setTotalReview(h.getTotalReview());

            // ===== OWNER =====
            if (h.getOwnerId() != null) {
                UserEntity owner = userRepo.findById(h.getOwnerId())
                        .orElseThrow(() -> new RuntimeException("Owner not found"));
                hotel.setOwner(owner);
            }

            // ===== HOTEL IMAGES =====
            h.getHotelImageUrls().forEach(url -> {
                Image img = new Image();
                img.setUrl(url);
                img.setHotel(hotel);
                hotel.getHotelImages().add(img);
            });

            // ===== HOTEL FACILITIES =====
            h.getHotelFacilities().forEach(f -> {
                HotelFacility hf = HotelFacility.builder()
                        .name(f.getName())
                        .icon(f.getIcon())
                        .hotel(hotel)
                        .build();
                hotel.getFacilities().add(hf);
            });

            // ===== ROOMS =====
            rooms.forEach(r -> {

                Room room = new Room();
                room.setRoomName(r.getRoomName());
                room.setRoomType(r.getRoomType());
                room.setRoomOccupancy(r.getRoomOccupancy());
                room.setRoomPricePerNight(r.getRoomPricePerNight());
                room.setRoomStatus(r.getRoomStatus());
                room.setDateAvailable(r.getDateAvailable());
                room.setHotel(hotel);

                // Room images
                r.getRoomImageUrls().forEach(url -> {
                    Image img = new Image();
                    img.setUrl(url);
                    img.setRoom(room);
                    room.getRoomImages().add(img);
                });

                // Room facilities
                r.getFacilities().forEach(f -> {
                    RoomFacility rf = RoomFacility.builder()
                            .name(f.getName())
                            .icon(f.getIcon())
                            .room(room)
                            .build();
                    room.getFacilities().add(rf);
                });

                hotel.getRooms().add(room);
            });

            // 🔥 CHỈ CẦN 1 DÒNG
            hotelRepo.save(hotel);
        }
    }
}

