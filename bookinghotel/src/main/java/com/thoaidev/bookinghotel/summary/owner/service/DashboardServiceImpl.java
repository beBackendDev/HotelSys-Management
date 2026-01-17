package com.thoaidev.bookinghotel.summary.owner.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.booking.repository.BookingRepo;
import com.thoaidev.bookinghotel.model.hotel.repository.HotelRepository;
import com.thoaidev.bookinghotel.model.payment.repository.PaymentRepository;
import com.thoaidev.bookinghotel.model.room.repository.RoomRepository;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.summary.owner.dto.DailyRevenueDto;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardTrendingRoomDTO;
import com.thoaidev.bookinghotel.summary.owner.repository.DashboardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private final BookingRepo bookingRepo;
    @Autowired
    private DashboardRepository repo;
    @Autowired
    private final PaymentRepository paymentRepo;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final HotelRepository hotelRepository;
    @Autowired
    private final RoomRepository roomRepo;
//getSummary 

    @Override
    public DashboardSummaryDTO getSummary(Integer ownerId, Integer month, Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();

        BigDecimal revenueBefore = new BigDecimal("0.0");
        BigDecimal revenue = paymentRepo.getTotalRevenue(ownerId, m, y);
        if (m == 1) {
            revenueBefore = paymentRepo.getTotalRevenue(ownerId, 12, y - 1);
        } else {
            revenueBefore = paymentRepo.getTotalRevenue(ownerId, m - 1, y);
        }
        Double revenueGrowthRate = ((revenue.doubleValue() - revenueBefore.doubleValue()) / revenueBefore.doubleValue()) * 100; //ti le booking thang truoc
        System.out.println("revenueGrowthRate: " + revenueGrowthRate);
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
        System.out.println("revenueGrowthRate" + revenueGrowthRate);
        return new DashboardSummaryDTO(
                revenue,
                totalBookings,
                totalRooms,
                Math.round(occupancy * 100.0) / 100.0,
                Math.round(revenueGrowthRate * 100.0) / 100.0,
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
//Daily

    @Override
    public List<DailyRevenueDto> getDailyRevenue(Integer ownerId, Integer hotelId, int year, int month) {
        UserEntity owner = userRepository.findById(ownerId).orElseThrow(
                () -> new RuntimeException("Owner not found")
        );
       List<Integer> ownerHotelIds =
            hotelRepository.findHotelIdsByOwnerId(owner.getUserId());

    if (ownerHotelIds.isEmpty()) return List.of();

    if (hotelId != null && !ownerHotelIds.contains(hotelId)) {
        throw new RuntimeException("Không có quyền truy cập khách sạn");
    }

        List<Integer> targetHotelIds
                = hotelId != null ? List.of(hotelId) : ownerHotelIds;

        List<Object[]> raw = repo.getDailyRevenue(targetHotelIds, year, month);

        Map<LocalDate, DailyRevenueDto> map = new HashMap<>();

        for (Object[] r : raw) {
            LocalDate date = ((java.sql.Date) r[0]).toLocalDate();
            Integer booking = ((Number) r[1]).intValue();
            BigDecimal revenue = (BigDecimal) r[2];

            map.put(date, new DailyRevenueDto(date, booking, revenue));
        }

        // Fill full month
        YearMonth ym = YearMonth.of(year, month);
        List<DailyRevenueDto> result = new ArrayList<>();

        for (int d = 1; d <= ym.lengthOfMonth(); d++) {
            LocalDate date = LocalDate.of(year, month, d);
            result.add(
                    map.getOrDefault(
                            date,
                            new DailyRevenueDto(date, 0, BigDecimal.ZERO)
                    )
            );
        }

        return result;
    }
}