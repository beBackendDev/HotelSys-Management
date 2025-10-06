package com.thoaidev.bookinghotel.model.room.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.enums.RoomStatus;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.image.service.ImageService;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;

@Service
public class RoomServiceImplement implements RoomService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public RoomServiceImplement(HotelRepository hotelRepository,
            RoomRepository roomRepository,
            RestTemplate restTemplate) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.restTemplate = restTemplate;
    }
    @Autowired
    private ImageService imageService;
//GET methods

    @Override
    public List<RoomDto> getRoomByHotelId(Integer id) {
        List<Room> rooms = roomRepository.findByHotel_HotelId(id);
        return rooms.stream()
                .map(room -> mapToRoomDto(room))
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto getRoomById(Integer roomId, Integer hotelId) {
        Hotel hotel
                = hotelRepository.findById(hotelId).orElseThrow(() -> new NotFoundException("Đối tượng Hotel không tồn tại"));
        Room room
                = roomRepository.findById(roomId).orElseThrow(() -> new NotFoundException("Đối tượng Room không tồn tại"));
        if (room.getHotel().getHotelId() != hotel.getHotelId()) {
            throw new NotFoundException("Đối tượng Room không tồn tại trong Hotel");
        }

        return mapToRoomDto(room);
    }

//POST methods
    @Override
    public RoomDto createRoom(Integer hotelId, RoomDto roomDto) {
        Hotel hotel = hotelRepository.findById(hotelId).orElseThrow(() -> new NotFoundException("Đối tượng Hotel không tồn tại"));

        Room room = new Room();
        room.setRoomId(roomDto.getRoomId());
        room.setRoomName(roomDto.getRoomName());
        room.setRoomOccupancy(roomDto.getRoomOccupancy());
        room.setRoomStatus(RoomStatus.AVAILABLE); // Mặc định
        room.setRoomType(roomDto.getRoomType());
        room.setRoomPricePerNight(roomDto.getRoomPricePerNight());
        room.setHotel(hotel);

//  Gán danh sách ảnh
        List<Image> imageEntities = Optional.ofNullable(roomDto.getRoomImageUrls())
                .orElse(Collections.emptyList())
                .stream()
                .map(url -> Image.builder()
                .url(url)
                .room(room)
                .build())
                .collect(Collectors.toList());

        room.setRoomImages(imageEntities);

        Room createdRoom = roomRepository.save(room);
        return mapToRoomDto(createdRoom);

    }
//UPDATE methods

    @Override
    public RoomDto updateRoom(Integer hotelId, Integer roomId, RoomDto roomDto) {
        Hotel hotel
                = hotelRepository.findById(hotelId).orElseThrow(() -> new NotFoundException("Đối tượng Hotel không tồn tại"));
        Room room
                = roomRepository.findById(roomId).orElseThrow(() -> new NotFoundException("Đối tượng Room không tồn tại"));

        // Chỉ cập nhật khi trường không null
        if (roomDto.getRoomName() != null) {
            room.setRoomName(roomDto.getRoomName());
        }
        // if (roomDto.getRoomImageUrls() != null) {
        //     List<Image> imageEntities = roomDto.getRoomImageUrls().stream()
        //             .map(url -> Image.builder()
        //             .url(url)
        //             .room(room) // liên kết ngược
        //             .build())
        //             .collect(Collectors.toList());
        //     room.setRoomImages(imageEntities);
        // }
//thực hiện kiểm tra ảnh được thêm vào có trùng với url ảnh cũ không?xóa:giữ thêm mới
        if (roomDto.getRoomImageUrls() != null) {
            Set<String> newUrls = new HashSet<>(roomDto.getRoomImageUrls());

            // Xoá ảnh không còn trong danh sách mới
            room.getRoomImages().removeIf(img -> !newUrls.contains(img.getUrl()));

            // Thêm ảnh mới chưa có
            newUrls.forEach(url -> {
                boolean exists = room.getRoomImages().stream()
                        .anyMatch(img -> img.getUrl().equals(url));
                if (!exists) {
                    room.getRoomImages().add(Image.builder()
                            .url(url)
                            .room(room)
                            .build());
                }
            });
        }

        if (roomDto.getRoomOccupancy() != null) {
            room.setRoomOccupancy(roomDto.getRoomOccupancy());
        }
        if (roomDto.getRoomPricePerNight() != null) {
            room.setRoomPricePerNight(roomDto.getRoomPricePerNight());
        }
        if (roomDto.getRoomStatus() != null) {
            room.setRoomStatus(roomDto.getRoomStatus());
        }
        if (roomDto.getRoomType() != null) {
            room.setRoomType(roomDto.getRoomType());
        }
        room.setHotel(hotel);

        Room updatedRoom = roomRepository.save(room);
        return mapToRoomDto(updatedRoom);
    }

//DELETE methods
    @Override
    public void deleteRoombyId(Integer hotelId, Integer roomId) {
        Hotel hotel
                = hotelRepository.findById(hotelId).orElseThrow(() -> new NotFoundException("Đối tượng Hotel không tồn tại"));
        Room room
                = roomRepository.findById(roomId).orElseThrow(() -> new NotFoundException("Đối tượng Room không tồn tại"));

        if (room.getHotel().getHotelId() != hotel.getHotelId()) {
            throw new NotFoundException("Đối tượng Room không nằm trong Hotel");

        }
        roomRepository.delete(room);
    }
//IMAGE UPLOAD

    @Override
    public List<String> imgUpload(Integer roomId, List<MultipartFile> files, String hotelName) {
        try {
            if (files == null || files.isEmpty()) {
                throw new IllegalArgumentException("Danh sách File không hợp lệ");
            }

            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng"));

            // Tạo danh sách chứa tất cả url ảnh được up lên
            List<String> uploadedUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file.isEmpty() || file.getOriginalFilename() == null) {
                    continue; // Bỏ qua file lỗi
                }
                String safeHotelName = hotelName.replaceAll("[^a-zA-Z0-9-_]", "_");
                String imageUrl = imageService.upload(file, safeHotelName + "/rooms/" + roomId);//trả về với url --> /uploads/hotelName/rooms/{roomId}/image.jpeg

                Image newImage = Image.builder()
                        .url(imageUrl)
                        .room(room)
                        .build();

                room.getRoomImages().add(newImage);
                uploadedUrls.add(imageUrl);
            }
            roomRepository.save(room);
            return uploadedUrls.stream()
                    .map(url -> url)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi đọc file upload: " + e.getMessage(), e);
        }
    }

//_____________Other Methods_____________
    private RoomDto mapToRoomDto(Room room) {
        // Lấy danh sách URL từ danh sách ảnh
        List<String> imageUrls = room.getRoomImages().stream()
                .map(Image::getUrl)
                .collect(Collectors.toList());

        RoomDto roomDto = RoomDto.builder()
                .roomId(room.getRoomId())
                .roomImageUrls(imageUrls)
                .roomName(room.getRoomName())
                .roomType(room.getRoomType())
                .roomOccupancy(room.getRoomOccupancy())
                .roomStatus(room.getRoomStatus())
                .roomPricePerNight(room.getRoomPricePerNight())
                .hotelId(room.getHotel().getHotelId())// foreign key 

                .build();
        return roomDto;
    }

}
