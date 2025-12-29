package com.thoaidev.bookinghotel.summary.owner.service;

import java.util.List;

import com.thoaidev.bookinghotel.summary.owner.dto.DailyRevenueDto;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.owner.dto.DashboardTrendingRoomDTO;

public interface DashboardService {

    public DashboardSummaryDTO getSummary(
            Integer ownerId,
            Integer month,
            Integer year);

    public List<DashboardTrendingRoomDTO> getTrendingRooms(
            Integer ownerId,
            Integer month,
            Integer year,
            int limit
    );

    public List<DailyRevenueDto> getDailyRevenue(Integer ownerId, Integer hotelId, int year, int month);
}
