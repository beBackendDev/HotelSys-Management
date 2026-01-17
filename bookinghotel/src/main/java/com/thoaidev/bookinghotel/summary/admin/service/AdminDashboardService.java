package com.thoaidev.bookinghotel.summary.admin.service;

import java.util.List;

import com.thoaidev.bookinghotel.summary.admin.dto.AdminDailyRevenueDto;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminDashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminTopOwnerDTO;
import com.thoaidev.bookinghotel.summary.admin.dto.AdminTrendingHotelDTO;

public interface AdminDashboardService {
    public AdminDashboardSummaryDTO getSummary(Integer month, Integer year);
    public List<AdminTrendingHotelDTO> getTrendingHotels(
            Integer month,
            Integer year,
            int limit
    );
    public List<AdminDailyRevenueDto> getDailyRevenue(int year, int month);
    public List<AdminTopOwnerDTO> getTopOwners(Integer month, Integer year, int limit);
    
}
