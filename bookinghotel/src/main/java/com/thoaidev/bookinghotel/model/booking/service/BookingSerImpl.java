package com.thoaidev.bookinghotel.model.booking.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.dto.response.BookingResponse;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.mapper.BookingMapper;
import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.enums.BookingStatus;
import com.thoaidev.bookinghotel.model.enums.RoomStatus;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;

;

@Service
public class BookingSerImpl implements BookingSer {

    @Autowired
    private BookingRepo bookingRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingMapper bookingMapper;

    //  Check room availability
    @Override
    public boolean isRoomAvailable(Integer roomId, LocalDate checkin, LocalDate checkout) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(roomId, checkin, checkout);
        return conflicts.isEmpty();
    }

    //  Cron job: huỷ booking quá hạn
    @Override
    @Scheduled(fixedRate = 60000)//cứ 60s thì thực hiện check 1 lần
    @Transactional
    public void cancelExpiredBookings() {
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(5);// thực hiện để thời gian tồn tại booking là 5 phút
        List<Booking> expired = bookingRepository.findExpiredBookings(expiryTime);
        for (Booking booking : expired) {
            booking.setStatus(BookingStatus.CANCELLED);
            Integer roomId = booking.getRoom().getRoomId();
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            room.setRoomStatus(RoomStatus.AVAILABLE);// đưa về mặc định
        }
        bookingRepository.saveAll(expired);

        if (!expired.isEmpty()) {
            System.out.println("Canceled  " + expired.size() + " Time out.");
        }
    }
    
    
    //Cron job thực hiện set booking_status
    @Scheduled(fixedRate = 60000)//60s/time
    @Transactional
    public void releaseCheckedOutRooms() {
        //Thực hiện lấy thông tin ngày giờ hiện tại
        LocalDate today = LocalDate.now();

        //Kiểm tra checkout_date 
        List<Booking> checkedOut = bookingRepository.findBookingsToRelease(today);

        //Thực hiện set lại mặc định các thông tin sau khi hết hạn booking
        for (Booking booking : checkedOut) {
            booking.setStatus(BookingStatus.COMPLETED); // đã hoàn tất lưu trú
            Room room = booking.getRoom();
            room.setRoomStatus(RoomStatus.AVAILABLE);
        }
        System.out.println("Found(BookingService): " + checkedOut.size());
        if (!checkedOut.isEmpty()) {
            bookingRepository.saveAll(checkedOut);
            System.out.println("Released " + checkedOut.size() + " rooms after checkout.");
        }
    }

    // Book Room
    @Override
    public Booking bookRoom(BookingDTO bookingDTO, UserEntity user) {
        if (!isRoomAvailable(bookingDTO.getRoomId(), bookingDTO.getCheckinDate(), bookingDTO.getCheckoutDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room isn't available that day");
        } else {
            //Khởi tạo một Booking mới
            Booking booking = new Booking();

            // Lấy thông tin khách sạn
            Hotel hotel = hotelRepository.findById(bookingDTO.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            // Lấy thông tin phòng
            Room room = roomRepository.findById(bookingDTO.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Tính số đêm
            long nights = ChronoUnit.DAYS.between(bookingDTO.getCheckinDate(), bookingDTO.getCheckoutDate());
            if (nights <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout date must be after checkin date");
            }

            // Tính tổng tiền
            BigDecimal totalPrice = room.getRoomPricePerNight()
                    .multiply(BigDecimal.valueOf(nights));
            //Tạo booking
            booking.setHotel(hotel);
            booking.setUser(user);
            booking.setRoom(room);
            room.setRoomStatus(RoomStatus.TEMP_HOLD);// thực hiện đặt room status là đang đợi thanh toán
            booking.setCheckinDate(bookingDTO.getCheckinDate());
            booking.setCheckoutDate(bookingDTO.getCheckoutDate());
            booking.setTotalPrice(totalPrice);
            booking.setStatus(BookingStatus.PENDING_PAYMENT);//auto pending _payment

            // Lưu người ở
            booking.setGuestFullName(bookingDTO.getGuestFullName());
            booking.setGuestPhone(bookingDTO.getGuestPhone());
            booking.setGuestEmail(bookingDTO.getGuestEmail());
            booking.setGuestCccd(bookingDTO.getGuestCccd());
            return bookingRepository.save(booking);
        }

    }

    // Cancel Booking
    @Override
    public void cancelBooking(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepository.delete(booking);
    }

    // Get Booking List
    @Override
    public BookingResponse getAllBookings(Integer userId, int pageNo, int pageSize) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("Người dùng không được tìm thấy"));

        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Booking> bookings = bookingRepository.findByUser(user, pageable);

        // List<BookingDTO> content = listOfBookings.stream().map((booking) -> mapToBookingDto(booking)).collect(Collectors.toList());
        List<BookingDTO> content = bookingMapper.toDTOList(bookings.getContent());

        BookingResponse bookingResponse = new BookingResponse();
        bookingResponse.setContent(content);
        bookingResponse.setPageNo(bookings.getNumber());
        bookingResponse.setPageSize(bookings.getSize());
        bookingResponse.setTotalElements(bookings.getTotalElements());
        bookingResponse.setTotalPage(bookings.getTotalPages());
        bookingResponse.setLast(bookings.isLast());
        return bookingResponse;
    }
    @Override
    public BookingDTO getBookingById(Integer id){
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Booking not Foung"));
            return bookingMapper.toDTO(booking);
    }
}
