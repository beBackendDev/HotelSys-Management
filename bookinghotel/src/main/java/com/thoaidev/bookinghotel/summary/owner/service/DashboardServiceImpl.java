package com.thoaidev.bookinghotel.summary.owner.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.payment.repository.PaymentRepository;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardTrendingRoomDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BookingRepo bookingRepo;
    private final PaymentRepository paymentRepo;
    private final UserRepository userRepository;
    private final RoomRepository roomRepo;
//getSummary 
    @Override
    public DashboardSummaryDTO getSummary(Integer ownerId, Integer month, Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();

        BigDecimal revenue = paymentRepo.getTotalRevenue(ownerId, m, y);
        Integer totalBookings = bookingRepo.countBookings(ownerId, m, y);
        Integer cancelled = bookingRepo.countCancelledBookings(ownerId, m, y);
        Integer totalRooms = roomRepo.countRooms(ownerId);

        int bookedDays = bookingRepo.getBookedRoomDays(ownerId, m, y);
        int daysInMonth = YearMonth.of(y, m).lengthOfMonth();

        Double occupancy = totalRooms == 0
                ? 0
                : (double) bookedDays / (totalRooms * daysInMonth) * 100; //tỉ lệ phòng được đặt trong tháng
        System.out.println("bookedDays" + bookedDays);
        System.out.println("totalRooms" + totalRooms);
        System.out.println("daysInMonth" + daysInMonth);
        System.out.println("occupancy" + occupancy);
        return new DashboardSummaryDTO(
                revenue,
                totalBookings,
                totalRooms,
                Math.round(occupancy * 100.0) / 100.0,
                cancelled
        );
    }
// getTrendingRooms
    @Override
    public List<DashboardTrendingRoomDTO> getTrendingRooms(
            Integer ownerId,
            Integer month,
            Integer year,
            int limit
    ) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        AtomicInteger rank = new AtomicInteger(1);

        List<DashboardTrendingRoomDTO> rooms
                = bookingRepo.findTrendingRoom(ownerId, m, y, PageRequest.of(0, 5))
                        .stream()
                        .map(p -> new DashboardTrendingRoomDTO(
                        p.getRoomId(),
                        p.getRoomName(),
                        p.getHotelName(),
                        p.getBookingCount(),
                        p.getBookedNights(),
                        BigDecimal.valueOf(p.getRevenue()),
                        rank.getAndIncrement()
                ))
                        .toList();

        return rooms.stream().map(r -> {
            DashboardTrendingRoomDTO dto = new DashboardTrendingRoomDTO();
            dto.setRoomId(r.getRoomId());
            dto.setRoomName(r.getRoomName());
            dto.setHotelName(r.getHotelName());
            dto.setBookingCount(r.getBookingCount());
            dto.setBookedNights(r.getBookedNights());
            dto.setRevenue(r.getRevenue());
            dto.setRank(rank.getAndIncrement());

            return dto;
        }).toList();
    }
// getRevenueChart
// getOccupancyChart

}
