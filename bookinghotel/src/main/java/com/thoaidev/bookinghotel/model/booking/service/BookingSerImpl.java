package com.thoaidev.bookinghotel.model.booking.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.thoaidev.bookinghotel.exceptions.BadRequestException;
import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.booking.dto.BookingConfirmedEvent;
import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.dto.response.BookingResponse;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.mapper.BookingMapper;
import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.enums.BookingStatus;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;
import com.thoaidev.bookinghotel.model.room.service.RoomService;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.model.voucher.entity.Voucher;
import com.thoaidev.bookinghotel.model.voucher.entity.VoucherUsage;
import com.thoaidev.bookinghotel.model.voucher.repository.VoucherRepository;
import com.thoaidev.bookinghotel.model.voucher.repository.VoucherUsageRepository;
import com.thoaidev.bookinghotel.model.voucher.service.VoucherService;

@Service
public class BookingSerImpl implements BookingSer {

    @Autowired
    private BookingRepo bookingRepository;
    @Autowired
    private  ApplicationEventPublisher eventPublisher;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingMapper bookingMapper;

    @Autowired
    private VoucherRepository voucherRepository;
    @Autowired
    private VoucherUsageRepository voucherUsageRepository;
    @Autowired
    private VoucherService voucherService;
        @Autowired
    private RoomService roomService;

    //  Check room availability
    @Override
    public boolean isRoomAvailable(Integer hotelId, Integer roomId, LocalDate checkin, LocalDate checkout) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(hotelId, roomId, checkin, checkout);
        return conflicts.isEmpty(); // true ? no conflict : conflict
    }

    //Check Avalable Room
    // Book Room
    @Override
    public Booking bookRoom(BookingDTO bookingDTO, UserEntity user) {
        if (!isRoomAvailable(bookingDTO.getHotelId(), bookingDTO.getRoomId(), bookingDTO.getCheckinDate(), bookingDTO.getCheckoutDate())) {
            throw new BadRequestException("Phòng đã có người đặt trong thời gian bạn chọn.");
        } else {
            //Khởi tạo một Booking mới
            Booking booking = new Booking();

            // Lấy thông tin khách sạn
            Hotel hotel = hotelRepository.findById(bookingDTO.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            // Lấy thông tin phòng

            Room room = roomService.validateRoomBelongsToHotel(
                    hotel.getHotelId(),
                    bookingDTO.getRoomId()
            );

            //Kiểm tra tính hợp lệ của checkin checkout
            if(bookingDTO.getCheckinDate().isBefore(LocalDate.now())){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkin date must not be in the past");
            }
            // Tính số đêm
            long nights = ChronoUnit.DAYS.between(bookingDTO.getCheckinDate(), bookingDTO.getCheckoutDate());
            
            if (nights <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout date must be after checkin date");
            }

            // Tính tổng tiền
            BigDecimal totalPrice = room.getFinalPrice()
                    .multiply(BigDecimal.valueOf(nights));

            // Áp dụng voucher nếu có
            BigDecimal discount = BigDecimal.ZERO;
            //Kiểm tra tồn tại Voucher
            if (bookingDTO.getVoucherCode() != null && !bookingDTO.getVoucherCode().isEmpty()) {
                // Validate voucher
                Voucher voucher = voucherService.validateVoucher(
                        bookingDTO.getVoucherCode(),
                        totalPrice);
                //  Không cho user dùng lại
                if (voucherUsageRepository
                        .existsByIdAndUserId(voucher.getVoucherId(), user.getUserId())) {
                    throw new RuntimeException("Voucher is used by user before");
                }
                // Tính giá tiền giảm giá
                discount = voucherService.calculateDiscount(voucher, totalPrice);
                // Cập nhật số lần sử dụng voucher
                voucher.setUsedCount(voucher.getUsedCount() + 1);
                // Cập nhật số lượng voucher
                voucher.setQuantity(voucher.getQuantity() - 1);
                voucherRepository.save(voucher);
                // Gán voucher cho booking
                booking.setVoucher(voucher);
            }
            //Tạo booking
            booking.setHotel(hotel);
            booking.setUser(user);
            booking.setRoom(room);
            //totalPrice -= discount
            final BigDecimal totalPriceAfterDiscount = totalPrice.subtract(discount);
            // room.setRoomStatus(RoomStatus.TEMP_HOLD);// thực hiện đặt room status là đang đợi thanh toán

            booking.setCheckinDate(bookingDTO.getCheckinDate());
            booking.setCheckoutDate(bookingDTO.getCheckoutDate());
            booking.setDiscountAmount(discount);
            booking.setTotalPrice(totalPrice);// giá gốc
            booking.setFinalAmount(totalPriceAfterDiscount);// giá sau khi đã trừ giảm giá
            booking.setStatus(BookingStatus.PENDING_PAYMENT);//auto pending _payment
            booking.setCreatedAt(LocalDateTime.now());
            // Lưu người ở
            booking.setGuestFullName(bookingDTO.getGuestFullName());
            booking.setGuestPhone(bookingDTO.getGuestPhone());
            booking.setGuestEmail(bookingDTO.getGuestEmail());
            booking.setGuestCccd(bookingDTO.getGuestCccd());
// Lưu booking
            if (booking.getVoucher() != null) {
                VoucherUsage usage = new VoucherUsage();
                usage.setVoucher(booking.getVoucher());
                usage.setUserId(user.getUserId());
                usage.setBookingId(booking.getBookingId());
                usage.setUsedAt(LocalDateTime.now());

                voucherUsageRepository.save(usage);
            }
            return bookingRepository.save(booking);
        }

    }

    //  Cron job: huỷ booking quá hạn
    @Override
    @Scheduled(fixedRate = 600000)//cứ 60s thì thực hiện check 1 lần
    @Transactional
    public void cancelExpiredBookings() {
        // CÁCH 1 thực hiện dựa trên room status -> nặng query

        // LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(5);// thực hiện để thời gian tồn tại booking là 5 phút
        // List<Booking> expired = bookingRepository.findExpiredBookings(expiryTime);
        // for (Booking booking : expired) {
        //     booking.setStatus(BookingStatus.CANCELLED);
        //     Integer roomId = booking.getRoom().getRoomId();
        //     Room room = roomRepository.findById(roomId)
        //             .orElseThrow(() -> new RuntimeException("Room not found"));
        //     room.setRoomStatus(RoomStatus.AVAILABLE);// đưa về mặc định
        // }
        // bookingRepository.saveAll(expired);

        // if (!expired.isEmpty()) {
        //     System.out.println("Canceled  " + expired.size() + " Time out.");
        // }


        //Cách 2 nhẹ hơn không phụ thuộc room
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(5);

        int cancelledCount = bookingRepository.cancelExpiredBookings(
                BookingStatus.PENDING_PAYMENT,
                BookingStatus.CANCELLED,
                expiryTime
        );

        if (cancelledCount > 0) {

            System.out.println("Cancelled {} expired bookings" + cancelledCount);
        }
    }

    //Cron job thực hiện set booking_status
    @Scheduled(fixedRate = 600000)//60s/time
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
            // room.setRoomStatus(RoomStatus.AVAILABLE);
            room.setDateAvailable(today);
        }
        System.out.println("Found(BookingService): " + checkedOut.size());
        if (!checkedOut.isEmpty()) {
            bookingRepository.saveAll(checkedOut);
            System.out.println("Released " + checkedOut.size() + " rooms after checkout.");
        }
    }

    @Transactional
    public void rollbackVoucher(Integer bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow();

        if (booking.getVoucher() == null) {
            return;
        }

        Voucher voucher = booking.getVoucher();
        voucher.setUsedCount(voucher.getUsedCount() - 1);
        voucherRepository.save(voucher);

        voucherUsageRepository
                .findByBookingId(bookingId)
                .forEach(voucherUsageRepository::delete);

        booking.setVoucher(null);
        booking.setDiscountAmount(BigDecimal.ZERO);
        booking.setTotalPrice(booking.getTotalPrice());

        bookingRepository.save(booking);
    }

    // Cancel Booking
    @Override
    public void cancelBooking(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        bookingRepository.delete(booking);
    }

    // Get Booking List with detailed user 
    @Override
    public BookingResponse getAllBookings(Integer userId, int pageNo, int pageSize) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("Người dùng không được tìm thấy"));
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(
                pageIndex,
                pageSize,
                Sort.by("createdAt").descending());
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

    // Get All Booking List
    @Override
    public BookingResponse getAllBookings(int pageNo, int pageSize) {
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(
                pageIndex,
                pageSize,
                Sort.by("createdAt").descending());
        Page<Booking> bookings = bookingRepository.findAll(pageable);

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
    public BookingDTO getBookingById(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Booking not Found"));
        return bookingMapper.toDTO(booking);
    }

    @Override
    public BookingResponse getBookingInDay(Integer ownerId, LocalDate date, int pageNo, int pageSize) {
        UserEntity user = userRepository.findById(ownerId).orElseThrow(() -> new UsernameNotFoundException("Người dùng không được tìm thấy"));

        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        // Tính khoảng thời gian cho ngày cần lọc
        LocalDate start = date;
        LocalDate end = date.plusDays(1);
        Page<Booking> bookings = bookingRepository.findBookingsByOwnerAndDate(user.getUserId(), start, end, pageable);
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

    public List<BookingDTO> getBookingByRoomId(Integer id, LocalDate today) {
        List<Booking> bookings = bookingRepository.findByRoomId(id, today);
        return bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingOfOwner(Integer ownerId, int pageNo, int pageSize) {
        UserEntity user = userRepository.findById(ownerId).orElseThrow(() -> new UsernameNotFoundException("Người dùng không được tìm thấy"));
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);

        List<Integer> hotelIds = hotelRepository.findAllByOwner_UserId(user.getUserId())
                .stream().map(Hotel::getHotelId).toList();
        Page<Booking> bookings = bookingRepository.findAllByHotelIds(hotelIds, pageable);
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
    public BookingResponse getRecentBookings(Integer ownerId, int pageNo, int pageSize) {
        UserEntity user = userRepository.findById(ownerId).orElseThrow(() -> new UsernameNotFoundException("Người dùng không được tìm thấy"));
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        LocalDate today = LocalDate.now();
        // List<Integer> hotelIds = hotelRepository.findAllByOwner_UserId(user.getUserId())
        //         .stream().map(Hotel::getHotelId).toList();
        Page<Booking> bookings = bookingRepository.findRecentBookings(user.getUserId(), today, pageable);
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
    public void confirmBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not Found"));
        if (!booking.getStatus().equals(BookingStatus.PENDING_PAYMENT)) {
            throw new RuntimeException("Booking expired");
        }

        if (booking.getStatus().equals(BookingStatus.PAID) || booking.getStatus().equals(BookingStatus.COMPLETED) || booking.getStatus().equals(BookingStatus.CANCELLED)) return;

        booking.setStatus(BookingStatus.PAID);
        bookingRepository.save(booking);

        eventPublisher.publishEvent(
            new BookingConfirmedEvent(booking.getBookingId())
        );

    }
}