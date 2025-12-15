package com.thoaidev.bookinghotel.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.thoaidev.bookinghotel.model.booking.service.BookingSer;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.dto.response.HotelResponse;
import com.thoaidev.bookinghotel.model.hotel.service.HotelService;
import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResponse;
import com.thoaidev.bookinghotel.model.payment.service.PaymentService;
import com.thoaidev.bookinghotel.model.review.dto.ReviewResponse;
import com.thoaidev.bookinghotel.model.review.service.ReviewSer;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.service.RoomService;
import com.thoaidev.bookinghotel.security.jwt.CustomUserDetail;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.owner.service.DashboardService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OwnerCtrl {

    @Autowired
    private final HotelService hotelService;
    @Autowired
    private final RoomService roomService;
    @Autowired
    private final DashboardService dashboardService;

    @Autowired
    private final BookingSer bookingService;
    @Autowired
    private final ReviewSer reviewSer;
    @Autowired
    private final PaymentService paymentService;

//SUMMARY
// GET /owner/summary (x)
// GET /owner/revenue?type=monthly&year=2025
// GET /owner/occupancy
// GET /owner/top-rooms
//Xem tổng quan các thông tin tổng quan (tổng booking, doanh thu, tỉ lệ đặt phòng..)
    @GetMapping("/owner/summary")
    public DashboardSummaryDTO getSummary(
            @AuthenticationPrincipal CustomUserDetail owner,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        return dashboardService.getSummary(owner.getId(), month, year);
    }
//Xem các booking đang hoạt động 
// GET /owner/recent-bookings

    @GetMapping("/owner/recent-bookings")
    public ResponseEntity<?> RecentBookings(
            @AuthenticationPrincipal CustomUserDetail owner,
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        Integer ownerId = owner.getId();

        return new ResponseEntity<>(bookingService.getRecentBookings(ownerId, pageNo, pageSize), HttpStatus.OK);
    }
//Xem trendingRooms
    // GET /owner/recent-bookings

    @GetMapping("/owner/trending-rooms")
    public ResponseEntity<?> getTrendingRooms(
            @AuthenticationPrincipal CustomUserDetail owner,
            @RequestParam(value = "month", required = false) Integer month,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "limit", defaultValue= "5", required = false) int limit

        ) {
        Integer ownerId = owner.getId();

        return new ResponseEntity<>(dashboardService.getTrendingRooms(ownerId, month, year, limit), HttpStatus.OK);
    }
//Xem danh sách phòng được đặt nhiều nhất

    @GetMapping("/owner/top-rooms")
    public ResponseEntity<?> getTopRoom(
            @AuthenticationPrincipal CustomUserDetail owner,
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        Integer ownerId = owner.getId();

        return new ResponseEntity<>(bookingService.getRecentBookings(ownerId, pageNo, pageSize), HttpStatus.OK);
    }

//Xem các bookin
//----HOTEL
//Lấy toàn bộ danh sách khách sạn của chủ sở hữu theo UserId
    @GetMapping("/owner/hotel-list")
    public ResponseEntity<HotelResponse> hotelsOfOwner(
            @AuthenticationPrincipal CustomUserDetail user,
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(hotelService.getAllHotels(user.getId(), pageNo, pageSize), HttpStatus.OK);

    }
//lấy thông tin khách sạn theo id

    @GetMapping("/owner/hotels/{id}")
    public ResponseEntity<HotelDto> hotelDetail(
            @PathVariable Integer id) {
        HotelDto hotelDto = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotelDto);
    }
//lấy thông tin dựa theo nhiều tiêu chí(tên, đánh giá...)

    @PostMapping("/owner/hotels/filter")
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
// Tạo khách sạn mới

    @PostMapping("/owner/{ownerId}/hotels/create")
    public HotelDto createHotel(
            @PathVariable("ownerId") Integer ownerId,
            @RequestBody HotelDto hotelDto) {
        return hotelService.createHotel(ownerId, hotelDto);
    }
//Cập nhật thông tin khách sạn

    @PutMapping("/owner/hotels/{id}/update")
    public ResponseEntity<HotelDto> updateHotel(
            @RequestBody HotelDto hotelDto,
            @PathVariable("id") Integer hotelId) {
        HotelDto response = hotelService.updateHotel(hotelDto, hotelId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

// Xóa khách sạn theo ID
    @DeleteMapping("/owner/hotels/{id}/delete")
    public ResponseEntity<String> deleteHotel(@PathVariable Integer id) {
        hotelService.deleteHotelById(id);
        return new ResponseEntity<>("Hotel deleted", HttpStatus.OK);
    }
//----ROOM
    //Xem toàn bộ phòng theo id khách sạn

    @GetMapping("/owner/{ownerId}/hotels/{hotelId}/rooms")
    public List<RoomDto> getRoomByHotelId(@PathVariable(value = "hotelId") Integer hotelId) {
        return roomService.getRoomByHotelId(hotelId);
    }

    //Xem phòng thông qua Id
    @GetMapping("/owner/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        RoomDto roomDto = roomService.getRoomById(roomId, hotelId);
        return new ResponseEntity<>(roomDto, HttpStatus.OK);
    }

    //Tạo mới phòng cho khách sạn theo id khách sạn
    @PostMapping("/owner/hotels/{hotelId}/create-room")
    public RoomDto createRoomDto(@PathVariable(value = "hotelId") Integer hotelId, @RequestBody RoomDto roomDto) {
        return roomService.createRoom(hotelId, roomDto);
    }

    //Cập nhật phòng theo id khách sạn
    @PutMapping("/owner/hotels/{hotelId}/update-room/{roomId}")
    public ResponseEntity<RoomDto> updateRoom(@RequestBody RoomDto roomDto, @PathVariable("hotelId") Integer hotelId, @PathVariable("roomId") Integer roomId) {
        RoomDto response = roomService.updateRoom(hotelId, roomId, roomDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //Xóa phòng theo id khách sạn
    @DeleteMapping("/owner/hotels/{hotelId}/delete-room/{roomId}")
    public ResponseEntity<String> deleteRoom(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        roomService.deleteRoombyId(hotelId, roomId);
        return new ResponseEntity<>("Room id =  + {roomId} + đã xóa", HttpStatus.OK);
    }
//BOOKING 
//Xem toàn bộ booking

    @GetMapping("/owner/bookings-management")
    public ResponseEntity<?> getOwnerBookings(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @AuthenticationPrincipal CustomUserDetail user) {
        Integer ownerId = user.getId();

        return new ResponseEntity<>(bookingService.getBookingOfOwner(ownerId, pageNo, pageSize), HttpStatus.OK);
    }

    @GetMapping("/owner/booking-today")
    public ResponseEntity<?> getBookingsOfOwnerByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @AuthenticationPrincipal CustomUserDetail user
    ) {
        return new ResponseEntity<>(bookingService.getBookingInDay(user.getId(), date, pageNo, pageSize), HttpStatus.OK);
    }

//------------------- PAYMENT -------------------   
    //Lấy toàn bộ danh sách Payment
    @GetMapping("/owner/hotels/payment-management")
    public ResponseEntity<?> getAllPayment(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @AuthenticationPrincipal CustomUserDetail user) {
        PaymentResponse paymentResponse = paymentService.getPaymentByOwner(user.getId(), pageNo, pageSize);

        return new ResponseEntity<>(paymentResponse, HttpStatus.OK);
    }

    //Lấy chi tiết payment
    @GetMapping("/owner/hotels/payment/{id}")
    public ResponseEntity<?> getMethodName(
            @PathVariable("id") Integer paymentId) {

        PaymentDto payment = paymentService.getPaymentById(paymentId);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }
//------------------- REVIEW -------------------   
    // Danh sách đánh giá Pagination

    @GetMapping("/owner/reviews-list")
    public ResponseEntity<ReviewResponse> reviews_list_user(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @AuthenticationPrincipal CustomUserDetail user
    ) {
        return new ResponseEntity<>(reviewSer.getReviewForOwner(user.getId(), pageNo, pageSize), HttpStatus.OK);
    }

    @GetMapping("/owner/user-review/{id}/reviews-list")
    public ResponseEntity<ReviewResponse> reviews_list_user(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @PathVariable Integer id
    ) {
        return new ResponseEntity<>(reviewSer.getReviewsByUserId(id, pageNo, pageSize), HttpStatus.OK);
    }
}
