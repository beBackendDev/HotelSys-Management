
package com.thoaidev.bookinghotel.summary.admin.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
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
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminDashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminTopOwnerDTO;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminTrendingHotelDTO;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminDailyRevenueDto;
import com.thoaidev.bookinghotel.summary.admin.repository.AdminDashboardRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private final BookingRepo bookingRepo;
    @Autowired
    private final AdminDashboardRepository repo;
    @Autowired
    private final PaymentRepository paymentRepo;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final HotelRepository hotelRepository;
    @Autowired
    private final RoomRepository roomRepo;

    /**
     * Lấy tóm tắt thống kê toàn hệ thống cho Admin
     * @param month Tháng (không bắt buộc, mặc định là tháng hiện tại)
     * @param year Năm (không bắt buộc, mặc định là năm hiện tại)
     * @return AdminDashboardSummaryDTO chứa các thông tin tổng quan
     */
    @Override
    public AdminDashboardSummaryDTO getSummary(Integer month, Integer year) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();

        // Doanh thu tháng hiện tại
        BigDecimal revenue = paymentRepo.getTotalRevenueAllHotels(m, y);
        
        // Doanh thu tháng trước để tính tỉ lệ tăng trưởng
        BigDecimal revenueBefore = new BigDecimal("0.0");
        if (m == 1) {
            revenueBefore = paymentRepo.getTotalRevenueAllHotels(12, y - 1);
        } else {
            revenueBefore = paymentRepo.getTotalRevenueAllHotels(m - 1, y);
        }
        
        Double revenueGrowthRate = revenueBefore.doubleValue() == 0
                ? 0
                : ((revenue.doubleValue() - revenueBefore.doubleValue()) / revenueBefore.doubleValue()) * 100;

        // Tổng booking tháng hiện tại
        Long totalBookings = bookingRepo.countBookingsAllHotels(m, y);
        
        // Tổng booking bị hủy
        Long cancelledBookings = bookingRepo.countCancelledBookingsAllHotels(m, y);
        
        // Tổng phòng trong hệ thống
        Integer totalRooms = roomRepo.countAllRooms();
        
        // Tổng khách sạn
        Integer totalHotels = hotelRepository.countAllHotels();
        
        // Tổng người dùng
        Integer totalUsers = userRepository.countAllUsers();
        
        // Tỉ lệ người dùng là chủ sở hữu
        Integer totalOwners = userRepository.countUsersByRole("OWNER");

        // Tính toán tỉ lệ chiếm dụng phòng
        Long bookedDays = bookingRepo.getBookedRoomDaysAllHotels(m, y);
        int daysInMonth = YearMonth.of(y, m).lengthOfMonth();
        Double occupancy = totalRooms == 0
                ? 0
                : (double) bookedDays / (totalRooms * daysInMonth) * 100;

        System.out.println("Admin Dashboard - revenueGrowthRate: " + revenueGrowthRate);
        System.out.println("Admin Dashboard - occupancy: " + occupancy);

        return new AdminDashboardSummaryDTO(
                revenue,
                totalBookings,
                totalRooms,
                totalHotels,
                totalUsers,
                totalOwners,
                Math.round(occupancy * 100.0) / 100.0,
                Math.round(revenueGrowthRate * 100.0) / 100.0,
                cancelledBookings
        );
    }

    /**
     * Lấy danh sách khách sạn trending (được đặt nhiều nhất)
     * @param month Tháng
     * @param year Năm
     * @param limit Số lượng kết quả (mặc định 5)
     * @return Danh sách khách sạn trending
     */
    @Override
    public List<AdminTrendingHotelDTO> getTrendingHotels(
            Integer month,
            Integer year,
            int limit
    ) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();
        AtomicInteger rank = new AtomicInteger(1);

        List<AdminTrendingHotelDTO> hotels
                = bookingRepo.findTrendingHotel(m, y, PageRequest.of(0, limit))
                        .stream()
                        .map(p -> new AdminTrendingHotelDTO(
                                p.getHotelId(),
                                p.getHotelName(),
                                p.getOwnerName(),
                                p.getBookingCount(),
                                p.getBookedNights(),
                                BigDecimal.valueOf(p.getRevenue()),
                                rank.getAndIncrement()
                        ))
                        .toList();

        return hotels.stream().map(h -> {
            AdminTrendingHotelDTO dto = new AdminTrendingHotelDTO();
            dto.setHotelId(h.getHotelId());
            dto.setHotelName(h.getHotelName());
            dto.setOwnerName(h.getOwnerName());
            dto.setBookingCount(h.getBookingCount());
            dto.setBookedNights(h.getBookedNights());
            dto.setRevenue(h.getRevenue());
            dto.setRank(rank.getAndIncrement());

            return dto;
        }).toList();
    }

    /**
     * Lấy doanh thu hàng ngày của toàn hệ thống
     * @param year Năm
     * @param month Tháng
     * @return Danh sách doanh thu theo ngày
     */
    @Override
    public List<AdminDailyRevenueDto> getDailyRevenue(int year, int month) {
        List<Object[]> raw = repo.getDailyRevenueAllHotels(year, month);

        Map<LocalDate, AdminDailyRevenueDto> map = new HashMap<>();

        for (Object[] r : raw) {
            LocalDate date = ((Timestamp) r[0]).toLocalDateTime().toLocalDate();
            Integer booking = ((Number) r[1]).intValue();
            BigDecimal revenue = (BigDecimal) r[2];

            map.put(date, new AdminDailyRevenueDto(date, booking, revenue));
        }

        // Điền đầy đủ tất cả ngày trong tháng
        YearMonth ym = YearMonth.of(year, month);
        List<AdminDailyRevenueDto> result = new ArrayList<>();

        for (int d = 1; d <= ym.lengthOfMonth(); d++) {
            LocalDate date = LocalDate.of(year, month, d);
            result.add(
                    map.getOrDefault(
                            date,
                            new AdminDailyRevenueDto(date, 0, BigDecimal.ZERO)
                    )
            );
        }

        return result;
    }

    /**
     * Lấy thống kê theo chủ sở hữu (Top owners by revenue)
     * @param month Tháng
     * @param year Năm
     * @param limit Số lượng owner
     * @return Danh sách top owners
     */
    @Override
    public List<AdminTopOwnerDTO> getTopOwners(Integer month, Integer year, int limit) {
        LocalDate now = LocalDate.now();
        int m = month != null ? month : now.getMonthValue();
        int y = year != null ? year : now.getYear();

        return paymentRepo.getTopOwnersByRevenueProjection(m, y, PageRequest.of(0, limit))
                .stream()
                .map(p -> new AdminTopOwnerDTO(
                        p.getOwnerId(),
                        p.getOwnerName(),
                        p.getHotelCount(),
                        p.getRoomCount(),
                        p.getRevenue(),
                        p.getBookingCount()
                ))
                .toList();
    }
}
