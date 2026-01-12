package com.thoaidev.bookinghotel.model.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thoaidev.bookinghotel.config.VNPayConfig;
import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.booking.service.BookingSer;
import com.thoaidev.bookinghotel.model.enums.PaymentStatus;
import com.thoaidev.bookinghotel.model.notification.service.NotificationService;
import com.thoaidev.bookinghotel.model.payment.dto.PaymentDto;
import com.thoaidev.bookinghotel.model.payment.dto.request.PaymentInitRequest;
import com.thoaidev.bookinghotel.model.payment.dto.response.PaymentResponse;
import com.thoaidev.bookinghotel.model.payment.entity.Payment;
import com.thoaidev.bookinghotel.model.payment.mapper.PaymentMapper;
import com.thoaidev.bookinghotel.model.payment.repository.PaymentRepository;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;

@Service
public class PaymentSerImpl implements PaymentService {

    @Autowired
    private BookingSer bookingService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private BookingRepo bookingRepository;
    @Autowired
    private PaymentMapper paymentMapper;
    @Autowired
    private RoomRepository roomRepository;

    //Thực hiện kiểm tra booking trong ngày
    @Override
    @Scheduled(fixedRate = 600000)//40p/time
    @Transactional
    public void checkDateBooking() {
        int time = 1;
        LocalDate today = LocalDate.now();
        List<Booking> bookingToday = bookingRepository.findBookingsToday(today);

        //Duyệt toàn bộ danh sách Booking hôm nay
        for (Booking booking : bookingToday) {
            time += 1;
            Room room = booking.getRoom();
            // room.setRoomStatus(RoomStatus.BOOKED);
            room.setDateAvailable(booking.getCheckoutDate().plusDays(1));

            roomRepository.save(room);

        }
        System.out.println("Found(BookingService): " + bookingToday);
        System.out.println("time check date booking: " + time);

    }

    @Override
    public int payByCash(PaymentInitRequest paymentRq) {
        Integer bookingId = paymentRq.getBookingId();
        String transactionId = VNPayConfig.getRandomNumber(8); // Mã giao dịch
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Room room = roomRepository.findById(booking.getRoom().getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Integer ownerId = booking.getHotel().getOwner().getUserId();
        String transactionAmount = booking.getFinalAmount()
                .multiply(new BigDecimal("100")) // nhân 100
                .setScale(0, RoundingMode.HALF_UP) // làm tròn về số nguyên
                .toPlainString(); // chuyển sang String không có dấu phẩy

        BigDecimal actualAmount = new BigDecimal(transactionAmount)
        .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        Payment payment = Payment.builder()
                .booking(booking)
                .transactionId(transactionId)
                .paymentAmount(actualAmount)
                .status(PaymentStatus.SUCCESS) // always success with Cash Method
                .paymentMethod("CASH")
                .createdAt(LocalDateTime.now())
                .build();
        
                bookingService.confirmBooking(booking.getBookingId());//gọi service để confirm booking
                // booking.setStatus(BookingStatus.PAID);

        //send notification
        notificationService.notifyOwnerNewBooking(ownerId, booking);
        // if (checkDateBooking(booking.getCheckinDate()) == 1) {
        //     room.setDateAvailable(booking.getCheckoutDate().plusDays(1));
        //     room.setRoomStatus(RoomStatus.BOOKED);
        // }
        paymentRepo.save(payment);

        return 1;
    }

    @Override
    public PaymentDto getPaymentById(Integer id) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found."));

        return paymentMapper.toDto(payment);
    }

    @Override
    public PaymentResponse getAllPayments(int pageNo, int pageSize) {
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1;
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<Payment> payments = paymentRepo.findAll(pageable);

        List<PaymentDto> content = paymentMapper.toDTOList(payments.getContent());

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setContent(content);
        paymentResponse.setPageNo(payments.getNumber());
        paymentResponse.setPageSize(payments.getSize());
        paymentResponse.setTotalElements(payments.getTotalElements());
        paymentResponse.setTotalPage(payments.getTotalPages());
        paymentResponse.setLast(payments.isLast());

        return paymentResponse;
    }

    @Override
    public PaymentResponse getPaymentByOwner(Integer ownerId, int pageNo, int pageSize) {
        UserEntity user = userRepository.findById(ownerId).orElseThrow(() -> new UsernameNotFoundException("Người dùng không được tìm thấy"));
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1;
        Pageable pageable = PageRequest.of(pageIndex, pageSize);

        Page<Payment> payments = paymentRepo.findAllPaymentsForOwner(user.getUserId(), pageable);
        List<PaymentDto> content = paymentMapper.toDTOList(payments.getContent());

        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setContent(content);
        paymentResponse.setPageNo(payments.getNumber());
        paymentResponse.setPageSize(payments.getSize());
        paymentResponse.setTotalElements(payments.getTotalElements());
        paymentResponse.setTotalPage(payments.getTotalPages());
        paymentResponse.setLast(payments.isLast());

        return paymentResponse;
    }
}
