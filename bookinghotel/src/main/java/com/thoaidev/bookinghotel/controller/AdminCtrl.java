package com.thoaidev.bookinghotel.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.model.enums.OwnerResponseStatus;
import com.thoaidev.bookinghotel.model.hotel.FilterRequest;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.dto.response.HotelResponse;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.service.HotelService;
import com.thoaidev.bookinghotel.model.role.OwnerResponseDTO;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.service.RoomService;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.request.UpdateUserRoleRequest;
import com.thoaidev.bookinghotel.model.user.dto.response.UserResponse;
import com.thoaidev.bookinghotel.model.user.service.UserService;
import com.thoaidev.bookinghotel.security.jwt.CustomUserDetail;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminCtrl {

    @Autowired
    private final HotelService hotelService;
    @Autowired
    private final RoomService roomService;
    @Autowired
    private final UserService userService;

    public AdminCtrl(HotelService hotelService, RoomService roomService, UserService userService) {
        this.hotelService = hotelService;
        this.roomService = roomService;
        this.userService = userService;
    }
//Example

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<String> adminDashboard() {
        System.out.println("Welcome Admin");
        return ResponseEntity.ok("Welcome Admin!");
    }

//------------------- HOTEL -------------------    
//-- GET methods
    //lấy toàn bộ thông tin khách sạn
    //http://localhost:8080/api/khach-san?pageNo=0&pageSize=5
    @GetMapping("/hotels")
    public ResponseEntity<HotelResponse> listHotels(
            @AuthenticationPrincipal CustomUserDetail user,
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(hotelService.getAllHotels(pageNo, pageSize), HttpStatus.OK);

    }
    //lấy thông tin khách sạn theo id

    @GetMapping("/hotels/{id}")
    public ResponseEntity<HotelDto> hotelDetail(
            @AuthenticationPrincipal CustomUserDetail user,
            @PathVariable Integer id) {
        HotelDto hotelDto = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotelDto);
    }
    //Lấy khách sạn theo vị trí

    @GetMapping("/hotels/search/{location}")
    public List<Hotel> getHotelsByAddress(@PathVariable String location) {
        return hotelService.getHotelsByAddress(location);
    }

    //lấy thông tin dựa theo nhiều tiêu chí(tên, đánh giá...)
    @PostMapping("/hotels/filter")
    public ResponseEntity<HotelResponse> getAllHotels(@RequestBody FilterRequest request) {
        HotelResponse hotels = hotelService.getAllHotels(request);
        return ResponseEntity.ok(hotels);
    }
    // Lấy khách sạn theo tên

    @GetMapping("/hotels/search/{name}")
    public List<Hotel> getHotelsByName(@RequestParam String name) {
        return hotelService.getHotelsByName(name);
    }
//-- POST methods
    // Tạo khách sạn mới

    @PostMapping("/hotels/create")
    public HotelDto createHotel(@RequestBody HotelDto hotelDto) {
        return hotelService.createHotel(hotelDto);
    }

//PUT methods
    @PutMapping("/hotels/{id}/update")
    public ResponseEntity<HotelDto> updateHotel(@RequestBody HotelDto hotelDto, @PathVariable("id") Integer hotelId) {
        HotelDto response = hotelService.updateHotel(hotelDto, hotelId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//DELETE methods
    // Xóa khách sạn theo ID
    @DeleteMapping("/hotels/{id}/delete")
    public ResponseEntity<String> deleteHotel(@PathVariable Integer id) {
        hotelService.deleteHotelById(id);
        return new ResponseEntity<>("Hotel deleted", HttpStatus.OK);
    }
//------------------- ROOM -------------------   
//GET methods

    @GetMapping("/hotels/{hotelId}/rooms")
    public List<RoomDto> getRoomByHotelId(@PathVariable(value = "hotelId") Integer hotelId) {
        return roomService.getRoomByHotelId(hotelId);
    }

    @GetMapping("/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        RoomDto roomDto = roomService.getRoomById(roomId, hotelId);
        return new ResponseEntity<>(roomDto, HttpStatus.OK);
    }
//POST methods

    @PostMapping("/hotels/{hotelId}/create-room")
    public RoomDto createRoomDto(@PathVariable(value = "hotelId") Integer hotelId, @RequestBody RoomDto roomDto) {
        return roomService.createRoom(hotelId, roomDto);
    }
//PUT methods

    @PutMapping("/hotels/{hotelId}/update-room/{roomId}")
    public ResponseEntity<RoomDto> updateRoom(@RequestBody RoomDto roomDto, @PathVariable("hotelId") Integer hotelId, @PathVariable("roomId") Integer roomId) {
        RoomDto response = roomService.updateRoom(hotelId, roomId, roomDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
//DELETE methods

    @DeleteMapping("/hotels/{hotelId}/delete-room/{roomId}")
    public ResponseEntity<String> deleteRoom(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        roomService.deleteRoombyId(hotelId, roomId);
        return new ResponseEntity<>("Room id =  + {roomId} + đã xóa", HttpStatus.OK);
    }
//IMAGE UPLOAD

    @PostMapping("/room/{roomId}/upload-image")
    public ResponseEntity<List<String>> uploadImageToRoom(
            @PathVariable Integer roomId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("hotel") String hotelName) {
        List<String> imageUrls = roomService.imgUpload(roomId, files, hotelName);
        return ResponseEntity.ok(imageUrls);
    }

    @PostMapping("/hotel/{hotelId}/upload-image")
    public ResponseEntity<List<String>> uploadImageToHotel(
            @PathVariable Integer hotelId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("hotel") String hotelName) {
        List<String> imageUrls = hotelService.imgUpload(hotelId, files, hotelName);
        return ResponseEntity.ok(imageUrls);
    }
//------------------- USER -------------------   
//-- GET methods
    //lấy toàn bộ thông tin khách sạn
    //http://localhost:8080/api/admin/nguoi-dung?pageNo=0&pageSize=5

    @GetMapping("/users")
    public ResponseEntity<UserResponse> listUsers(
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(userService.getAllUser(pageNo, pageSize), HttpStatus.OK);

    }

    //lấy thông tin user theo id
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> userDetail(@PathVariable Integer id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    //PUT methods
    @PutMapping("/users/{id}/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto,
            @PathVariable("id") Integer userId) {
        UserDto response = userService.updateUser(userDto, userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//DELETE methods
    // Xóa khách sạn theo ID
    @DeleteMapping("/users/{id}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {

        userService.deleteUserById(id);
        return new ResponseEntity<>("User deleted", HttpStatus.OK);
    }

// Mở rộng cho OWNER
    //Response Owner
    @PutMapping("/update-role/user/{id}")
    public ResponseEntity<String> updateRole(@PathVariable("id") Integer userId,
            @RequestBody OwnerResponseDTO res) {
                 System.out.println("===> Controller received: userId=" + userId + ", decision=" + res.getDecision() +"/"+ OwnerResponseStatus.APPROVED.name());
                //request = {userId, roleName}
        userService.updateRole(userId, res.getDecision());
        return new ResponseEntity<>(res.getAdminNote(), HttpStatus.OK);
    }
}
