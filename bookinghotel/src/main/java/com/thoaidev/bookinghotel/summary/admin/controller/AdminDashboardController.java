package com.thoaidev.bookinghotel.summary.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thoaidev.bookinghotel.summary.admin.dto.AdminDashboardSummaryDTO;
import com.thoaidev.bookinghotel.summary.admin.service.AdminDashboardService;

@RestController
@RequestMapping("/api/dashboard/admin")
@CrossOrigin("*")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<AdminDashboardSummaryDTO> getSummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        AdminDashboardSummaryDTO summary = dashboardService.getSummary(month, year);
        return new ResponseEntity<>(summary, HttpStatus.OK);
    }

    @GetMapping("/trending-hotels")
    public ResponseEntity<?> getTrendingHotels(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "5") int limit) {
        return new ResponseEntity<>(
                dashboardService.getTrendingHotels(month, year, limit),
                HttpStatus.OK
        );
    }

    @GetMapping("/daily-revenue")
    public ResponseEntity<?> getDailyRevenue(
            @RequestParam int year,
            @RequestParam int month) {
        return new ResponseEntity<>(
                dashboardService.getDailyRevenue(year, month),
                HttpStatus.OK
        );
    }

    @GetMapping("/top-owners")
    public ResponseEntity<?> getTopOwners(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "5") int limit) {
        return new ResponseEntity<>(
                dashboardService.getTopOwners(month, year, limit),
                HttpStatus.OK
        );
    }
}