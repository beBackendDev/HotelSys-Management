package com.thoaidev.bookinghotel.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
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
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.service.BookingSer;
import com.thoaidev.bookinghotel.model.favorite.FavoriteSer;
import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;
import com.thoaidev.bookinghotel.model.hotel.dto.response.HotelResponse;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;
import com.thoaidev.bookinghotel.model.hotel.mapper.HotelMapper;
import com.thoaidev.bookinghotel.model.hotel.service.HotelService;
import com.thoaidev.bookinghotel.model.payment.dto.request.PaymentInitRequest;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResDTO;
import com.thoaidev.bookinghotel.model.payment.service.VNPayService;
import com.thoaidev.bookinghotel.model.review.dto.ReviewResponse;
import com.thoaidev.bookinghotel.model.review.service.ReviewSer;
import com.thoaidev.bookinghotel.model.room.dto.RoomDto;
import com.thoaidev.bookinghotel.model.room.service.RoomService;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.request.ChangePasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ForgetPwRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.OwnerRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ResetPasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.UserUpdateRequest;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.service.UserService;
import com.thoaidev.bookinghotel.security.jwt.CustomUserDetail;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserCtrl {

    private final UserService userService;
    private final HotelService hotelService;
    private final VNPayService vnPayService;
    private final RoomService roomService;
    private final BookingSer bookingService;
    private final ReviewSer reviewSer;
    private final FavoriteSer favoriteSer;

    public UserCtrl(
            UserService userService,
            HotelService hotelService,
            RoomService roomService,
            BookingSer bookingService,
            VNPayService vnPayService,
            ReviewSer reviewSer,
            FavoriteSer favoriteSer) {
        this.userService = userService;
        this.hotelService = hotelService;
        this.roomService = roomService;
        this.bookingService = bookingService;
        this.vnPayService = vnPayService;
        this.reviewSer = reviewSer;
        this.favoriteSer = favoriteSer;
    }

//  Đăng ký tài khoản
// Đăng nhập / Đăng xuất
//------------------- HOTEL -------------------    
    // Xem danh sách khách sạn (có thể kèm filter theo giá, tiện ích, đánh giá, địa điểm...)
    @GetMapping("/public/hotels")
    public ResponseEntity<HotelResponse> listHotels(
            @RequestParam(value = "pageNo", defaultValue = "1", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(hotelService.getAllHotels(pageNo, pageSize), HttpStatus.OK);

    }

    @GetMapping("/public/hotels/{hotelId}/rooms")
    public List<RoomDto> getRoomByHotelId(@PathVariable(value = "hotelId") Integer hotelId) {
        return roomService.getRoomByHotelId(hotelId);
    }

    // Xem chi tiết khách sạn + phòng
    @GetMapping("/public/hotels/{id}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable("id") Integer hotelId) {
        HotelDto hotel = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(hotel);

    }

    //Xem chi tiết phòng trong khách sạn
    @GetMapping("/public/hotels/{hotelId}/rooms/{roomId}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable(value = "hotelId") Integer hotelId, @PathVariable(value = "roomId") Integer roomId) {
        RoomDto roomDto = roomService.getRoomById(roomId, hotelId);
        return new ResponseEntity<>(roomDto, HttpStatus.OK);
    }

    // Tìm kiếm( lọc) khách sạn theo từ khóa, địa điểm(filter)
    @GetMapping("/public/hotels/filter")
    public ResponseEntity<HotelResponse> getAllHotels(
        @RequestParam (value = "hotelName", required = false) String hotelName,
        @RequestParam (value = "hotelAddress", required = false) String hotelAddress,
        @RequestParam (value = "hotelAveragePrice", required = false) BigDecimal hotelAveragePrice,
        @RequestParam (value = "hotelFacilities", required = false) List<String> hotelFacilities,
        @RequestParam (value = "ratingPoint", required = false) Double ratingPoint,
        @RequestParam (value = "ownerId", required = false) Integer ownerId
        ) {
        HotelResponse hotels = hotelService.filterHotels(hotelName, hotelAddress, hotelAveragePrice, hotelFacilities, ratingPoint, ownerId);
        return ResponseEntity.ok(hotels);
    }

    //Kiểm tra tình trạng phòng
    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam Integer roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate checkin,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate checkout
    ) {
        boolean available = bookingService.isRoomAvailable(roomId, checkin, checkout);
        return ResponseEntity.ok(Map.of("available", available));
    }

// ------------------- BOOKING -------------------    
    // Đặt phòng (Chọn khách sạn → phòng → nhập thông tin → đặt)
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/hotels/bookings")
    public ResponseEntity<?> bookRoom(@AuthenticationPrincipal CustomUserDetail userDetails,
            @RequestBody BookingDTO bookingDTO) {
        //không nên thực hiện return thẳng giá trị biến entity mà phải chuyển sang DTO để tránh gây ra vòng lặp vô hạn, hoặc lỗi Serialization, hoặc lỗi AccessDenied
        // Booking booking = bookingService.bookRoom(bookingDTO);
        UserEntity user = userService.findByUsername(userDetails.getUsername());
        Booking booking = bookingService.bookRoom(bookingDTO, user);

        return ResponseEntity.ok(Map.of(
                "bookingId", booking.getBookingId(),
                "bookingStatus", booking.getStatus(),
                "totalPrice", booking.getTotalPrice(),
                "redirectToPayment", true
        ));
    }
    // Hủy đặt phòng

    @DeleteMapping("/hotels/bookings/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok("Booking cancelled");
    }
    // Xem toàn bộ lịch sử đặt phòng)(với từng username thì xem lịch sử tương ứng username đó)

    @GetMapping("/hotels/booking-management")
    public ResponseEntity<BookingResponse> listBookings(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @AuthenticationPrincipal CustomUserDetail userDetails) {
        return new ResponseEntity<>(bookingService.getAllBookings(userDetails.getId(), pageNo, pageSize), HttpStatus.OK);

    }
    //Xem chi tiết booking
    @GetMapping("/hotels/booking/{id}")
    public ResponseEntity<BookingDTO> getBooking(
            @PathVariable Integer id
    ) {
        BookingDTO booking = bookingService.getBookingById(id);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

// ------------------- PAYMENT -------------------    
    //Trả về kết quả đặt phòng
    @GetMapping("/result/vnpay-payment")
    public String GetMapping(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);
        return paymentStatus == 1 ? "ordersuccess" : "orderfail";
    }

    //Thực hiện thanh toán (Thanh toán VNPay)
    @PostMapping("/VNPay/create-payment")
    public ResponseEntity<?> createPayment(@RequestBody PaymentInitRequest req, HttpServletRequest servletRequest) throws Exception {
        String url = vnPayService.createOrder(req, servletRequest);
        PaymentResDTO response = new PaymentResDTO(
                req.getBookingId(),
                req.getAmount(), 
                "Payment created successfully", // message mô tả hoặc req.getOrderInfo()
                url // link VNPay trả về
        );
        return ResponseEntity.ok(response);
    }
//------------------- REVIEW -------------------    
    // Đánh giá khách sạn

    @PostMapping("/hotels/reviews")
    public ResponseEntity<?> createReview(@RequestBody HotelReviewDTO reviewDTO) {
        reviewSer.createReview(reviewDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("hotel id", reviewDTO.getHotelId());
        response.put("user id", reviewDTO.getUserId());
        response.put("rating point", reviewDTO.getRatingPoint());
        response.put("created", reviewDTO.getCreatedAt());
        response.put("comment", reviewDTO.getComment());
        return ResponseEntity.ok(response);
    }
    // Xem danh sách đánh giá theo hotelId

    @GetMapping("/hotel/{id}/reviews-list")
    public ResponseEntity<ReviewResponse> reviews_list_hotel(
            @RequestParam(value = "pageNo", defaultValue = "", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "", required = false) int pageSize,
            @PathVariable Integer id
    ) {
        return new ResponseEntity<>(reviewSer.getReviewsByHotelId(id, pageNo, pageSize), HttpStatus.OK);
    }

    // Danh sách đánh giá Pagination
    @GetMapping("/user/{id}/reviews-list")
    public ResponseEntity<ReviewResponse> reviews_list_user(
            @RequestParam(value = "pageNo", defaultValue = "", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "", required = false) int pageSize,
            @PathVariable Integer id
    ) {
        return new ResponseEntity<>(reviewSer.getReviewsByUserId(id, pageNo, pageSize), HttpStatus.OK);
    }

//------------------- FAVORITE -------------------    
    // Yêu thích khách sạn
    @PostMapping("/favorites/add")
    public ResponseEntity<String> addFavorite(@AuthenticationPrincipal CustomUserDetail user,
            @RequestParam(name = "hotelId") Integer hotelId) {
        favoriteSer.addFavorite(user.getId(), hotelId);
        System.out.println(">>>user id: =" + user.getId());
        return ResponseEntity.ok("Hotel added to favorites.");
    }
    // Xem, Xóa danh sách khách sạn đã yêu thích

    @DeleteMapping("/favorites/remove")
    public ResponseEntity<String> removeFavorite(@AuthenticationPrincipal CustomUserDetail user, @RequestParam int hotelId) {
        favoriteSer.removeFavorite(user.getId(), hotelId);
        return ResponseEntity.ok("Hotel removed from favorites.");
    }

    //Xem danh sách Favorite
    @GetMapping("/favorites/list")
    public ResponseEntity<Set<HotelDto>> getFavorites(@AuthenticationPrincipal CustomUserDetail user) {
        HotelMapper mapper = new HotelMapper();
        Set<Hotel> favorites = favoriteSer.getFavorites(user.getId());
        Set<HotelDto> dtoList = favorites.stream()
                .map(mapper::mapToHotelDto) // cần constructor HotelDto(Hotel)
                .collect(Collectors.toSet());
        return ResponseEntity.ok(dtoList);
    }
//------------------- USER -------------------    

    //Đăng kí thành OWNER 
    @PostMapping("/owner-request")
    public ResponseEntity<?> postMethodName(
            @AuthenticationPrincipal CustomUserDetail user,
            @RequestBody OwnerRequest ownerRq) {

        userService.updateOnwerRequest(user.getId(), ownerRq);
        Map<String, Object> response = new HashMap<>();
        response.put("user id:", user.getId());
        response.put("Business License Number:", ownerRq.getBusinessLicenseNumber());
        response.put("Owner Experience:", ownerRq.getExperienceInHospitality());
        response.put("Owner Description:", ownerRq.getOwnerDescription());

        return ResponseEntity.ok(response);
    }

    // Xem thông tin cá nhân thoong qua JWT Token
    @PostMapping("/image/{userId}/upload")
    public ResponseEntity<String> userAvatar(
            @PathVariable Integer userId,
            @RequestParam("files") MultipartFile files
    ) {
        String avtUrl = userService.uploadUserAvatar(userId, files);
        return ResponseEntity.ok(avtUrl);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> userDetail(@AuthenticationPrincipal CustomUserDetail user) {
        UserDto userDto = userService.getUserById(user.getId());
        return ResponseEntity.ok(userDto);
    }

    //Xem theo Id
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserDto> userDetailById(@PathVariable Integer userId) {
        UserDto userDto = userService.getUserById(userId);
        return ResponseEntity.ok(userDto);
    }
    // Chỉnh sửa thông tin cá nhân

    @PutMapping("/profile/update")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal CustomUserDetail user,
            @RequestBody UserUpdateRequest updateRequest) {
        UserDto updateUser = userService.updateProfile(user.getId(), updateRequest);
        return ResponseEntity.ok(updateUser);
    }
    // Đổi mật khẩu 
    // Cấp lại token mới

    @PutMapping("/profile/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal CustomUserDetail user,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user.getId(), request);
        return ResponseEntity.ok("Password updated successfully.");
    }

// // quên mật khẩu (email)
// //gửi mã code về email để thực hiện đổi mật khẩu
    @PostMapping("/public/forgot-password")
    public ResponseEntity<String> sendResetCode(@RequestBody ForgetPwRequest email) {
        userService.sendResetPasswordCode(email);
        return ResponseEntity.ok("Reset code sent to email.");
    }

    //Thực hiện thao tác reset PW
    @PostMapping("/public/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        userService.resetPasswordWithCode(request);
        return ResponseEntity.ok("Password has been reset.");
    }

// Thanh toán (QR code, Momo, v.v.)
//------------------- ROOM -------------------    
//------------------- USER -------------------    
}
