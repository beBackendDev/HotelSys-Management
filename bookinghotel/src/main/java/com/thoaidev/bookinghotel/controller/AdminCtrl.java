package com.thoaidev.bookinghotel.controller;

import java.math.BigDecimal;
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

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.dto.response.BookingResponse;
import com.thoaidev.bookinghotel.model.booking.service.BookingSer;
import com.thoaidev.bookinghotel.model.enums.OwnerResponseStatus;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.dto.response.HotelResponse;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.service.HotelService;
import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResponse;
import com.thoaidev.bookinghotel.model.payment.service.PaymentService;
import com.thoaidev.bookinghotel.model.review.dto.ReviewResponse;
import com.thoaidev.bookinghotel.model.review.service.ReviewSer;
import com.thoaidev.bookinghotel.model.role.OwnerResponseDTO;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.service.RoomService;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.response.UserResponse;
import com.thoaidev.bookinghotel.model.user.service.UserService;
import com.thoaidev.bookinghotel.security.jwt.CustomUserDetail;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@AllArgsConstructor
public class AdminCtrl {

    @Autowired
    private final HotelService hotelService;
    @Autowired
    private final RoomService roomService;
    @Autowired
    private final UserService userService;
    @Autowired
    private final BookingSer bookingService;
    @Autowired
    private final ReviewSer reviewSer;
    @Autowired
    private final PaymentService paymentService;

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
    @GetMapping("/admin/hotels")
    public ResponseEntity<HotelResponse> listHotels(
            @AuthenticationPrincipal CustomUserDetail user,
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(hotelService.getAllHotels(pageNo, pageSize), HttpStatus.OK);

    }

    //
//Lấy thông tin khách sạn theo từng owner
    @GetMapping("/admin/user/public/owner/{ownerId}/hotels")
    public ResponseEntity<HotelResponse> hotelsOfOwner(
            @AuthenticationPrincipal CustomUserDetail user,
            @PathVariable Integer ownerId,
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(hotelService.getAllHotels(ownerId, pageNo, pageSize), HttpStatus.OK);

    }
    //lấy thông tin khách sạn theo id

    @GetMapping("/admin/hotels/{id}")
    public ResponseEntity<HotelDto> hotelDetail(
            @AuthenticationPrincipal CustomUserDetail user,
            @PathVariable Integer id) {
        HotelDto hotelDto = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotelDto);
    }
    //Lấy khách sạn theo vị trí

    @GetMapping("/admin/hotels/search/{location}")
    public List<Hotel> getHotelsByAddress(@PathVariable String location) {
        return hotelService.getHotelsByAddress(location);
    }

    //lấy thông tin dựa theo nhiều tiêu chí(tên, đánh giá...)
    @PostMapping("/admin/hotels/filter")
    public ResponseEntity<HotelResponse> getAllHotels(
            @RequestParam(value = "hotelName", required = false) String hotelName,
            @RequestParam(value = "hotelAddress", required = false) String hotelAddress,
            @RequestParam(value = "hotelAveragePrice", required = false) BigDecimal hotelAveragePrice,
            @RequestParam(value = "hotelFacilities", required = false) List<String> hotelFacilities,
            @RequestParam(value = "ratingPoint", required = false) Double ratingPoint,
            @RequestParam(value = "ownerId", required = false) Integer ownerId
    ) {
        HotelResponse hotels = hotelService.filterHotels(hotelName, hotelAddress, hotelAveragePrice, hotelFacilities, ratingPoint, ownerId);
        return ResponseEntity.ok(hotels);
    }
    // Lấy khách sạn theo tên

    @GetMapping("/admin/hotels/search/{name}")
    public List<Hotel> getHotelsByName(@RequestParam String name) {
        return hotelService.getHotelsByName(name);
    }
//-- POST methods
    // Tạo khách sạn mới

    @PostMapping("/admin/hotels/create")
    public HotelDto createHotel(@RequestBody HotelDto hotelDto) {
        return hotelService.createHotel(hotelDto);
    }

//PUT methods
    @PutMapping("/admin/hotels/{id}/update")
    public ResponseEntity<HotelDto> updateHotel(@RequestBody HotelDto hotelDto, @PathVariable("id") Integer hotelId) {
        HotelDto response = hotelService.updateHotel(hotelDto, hotelId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//DELETE methods
    // Xóa khách sạn theo ID
    @DeleteMapping("/admin/hotels/{id}/delete")
    public ResponseEntity<String> deleteHotel(@PathVariable Integer id) {
        hotelService.deleteHotelById(id);
        return new ResponseEntity<>("Hotel deleted", HttpStatus.OK);
    }
//------------------- ROOM -------------------   
//GET methods

    @GetMapping("/admin/hotels/{hotelId}/rooms")
    public List<RoomDto> getRoomByHotelId(@PathVariable(value = "hotelId") Integer hotelId) {
        return roomService.getRoomByHotelId(hotelId);
    }

    @GetMapping("/admin/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        RoomDto roomDto = roomService.getRoomById(roomId, hotelId);
        return new ResponseEntity<>(roomDto, HttpStatus.OK);
    }
//POST methods

    @PostMapping("/admin/hotels/{hotelId}/create-room")
    public RoomDto createRoomDto(@PathVariable(value = "hotelId") Integer hotelId, @RequestBody RoomDto roomDto) {
        return roomService.createRoom(hotelId, roomDto);
    }
//PUT methods

    @PutMapping("/admin/hotels/{hotelId}/update-room/{roomId}")
    public ResponseEntity<RoomDto> updateRoom(@RequestBody RoomDto roomDto, @PathVariable("hotelId") Integer hotelId, @PathVariable("roomId") Integer roomId) {
        RoomDto response = roomService.updateRoom(hotelId, roomId, roomDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
//DELETE methods

    @DeleteMapping("/admin/hotels/{hotelId}/delete-room/{roomId}")
    public ResponseEntity<String> deleteRoom(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        roomService.deleteRoombyId(hotelId, roomId);
        return new ResponseEntity<>("Room id =  + {roomId} + đã xóa", HttpStatus.OK);
    }
//IMAGE UPLOAD

    @PostMapping("/admin/room/{roomId}/upload-image")
    public ResponseEntity<List<String>> uploadImageToRoom(
            @PathVariable Integer roomId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("hotel") String hotelName) {
        List<String> imageUrls = roomService.imgUpload(roomId, files, hotelName);
        return ResponseEntity.ok(imageUrls);
    }

    @PostMapping("/admin/hotel/{hotelId}/upload-image")
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

    @GetMapping("/admin/users")
    public ResponseEntity<UserResponse> listUsers(
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(userService.getAllUser(pageNo, pageSize), HttpStatus.OK);

    }

    //lấy thông tin user theo id
    @GetMapping("/admin/users/{id}")
    public ResponseEntity<UserDto> userDetail(@PathVariable Integer id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    //PUT methods
    @PutMapping("/admin/users/{id}/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody UserDto userDto,
            @PathVariable("id") Integer userId) {
        UserDto response = userService.updateUser(userDto, userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//DELETE methods
    // Xóa khách sạn theo ID
    @DeleteMapping("/admin/users/{id}/delete")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {

        userService.deleteUserById(id);
        return new ResponseEntity<>("User deleted", HttpStatus.OK);
    }
//------------------- BOOKING -------------------   

    //Xem toàn bộ booking
    @GetMapping("/admin/bookings-management")
    public ResponseEntity<BookingResponse> listBookings(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize) {
        return new ResponseEntity<>(bookingService.getAllBookings(pageNo, pageSize), HttpStatus.OK);

    }
        //Xem toàn bộ booking cua User
    @GetMapping("/admin/hotels/{userId}/bookings-management")
    public ResponseEntity<BookingResponse> userBookings(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @PathVariable Integer userId
        ) {
        return new ResponseEntity<>(bookingService.getAllBookings(userId, pageNo, pageSize), HttpStatus.OK);

    }
    //Xem chi tiết booking
    @GetMapping("/admin/hotels/booking/{id}")
    public ResponseEntity<BookingDTO> getBooking(
            @PathVariable Integer id
    ) {
        BookingDTO booking = bookingService.getBookingById(id);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    //Hủy/ Xóa booking
    @DeleteMapping("/admin/hotels/cancel-booking/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled");
    }
//------------------- PAYMENT -------------------   
    //Lấy toàn bộ danh sách Payment

    @GetMapping("/admin/hotels/payment-management")
    public ResponseEntity<?> getAllPayment(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize) {
        PaymentResponse paymentResponse = paymentService.getAllPayments(pageNo, pageSize);

        return new ResponseEntity<>(paymentResponse, HttpStatus.OK);
    }

    //Lấy chi tiết payment
    @GetMapping("/admin/hotels/payment/{id}")
    public ResponseEntity<?> getMethodName(
        @PathVariable("id") Integer paymentId) {

            PaymentDto payment = paymentService.getPaymentById(paymentId);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

//------------------- REVIEW -------------------   
    // Danh sách đánh giá Pagination
    @GetMapping("/admin/reviews-list")
    public ResponseEntity<ReviewResponse> reviews_list_user(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(reviewSer.getAllReviews(pageNo, pageSize), HttpStatus.OK);
    }

    @GetMapping("/admin/user-review/{id}/reviews-list")
    public ResponseEntity<ReviewResponse> reviews_list_user(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @PathVariable Integer id
    ) {
        return new ResponseEntity<>(reviewSer.getReviewsByUserId(id, pageNo, pageSize), HttpStatus.OK);
    }
// Mở rộng cho OWNER
    //Response Owner

    @PutMapping("/admin/update-role/user/{id}")
    public ResponseEntity<String> updateRole(
            @PathVariable("id") Integer userId,
            @RequestBody OwnerResponseDTO res) {
        System.out.println("===> Controller received: userId=" + userId + ", decision=" + res.getDecision() + "/" + OwnerResponseStatus.APPROVED.name());
        //request = {userId, roleName}
        userService.updateRole(userId, res.getDecision());
        return new ResponseEntity<>(res.getAdminNote(), HttpStatus.OK);
    }
}
