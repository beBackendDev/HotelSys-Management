package com.thoaidev.bookinghotel.data.controller;

// import com.thoaidev.bookinghotel.service.DataSeedService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thoaidev.bookinghotel.data.service.DataSeedServiceImpl;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DataSeedController {

    private final DataSeedServiceImpl dataSeedService;

    /**
     * Import toàn bộ dữ liệu seed từ file JSON
     * Dùng cho dev / reset DB
     */
    @PostMapping("/admin/import")
    public ResponseEntity<?> importSeedData() {
        try {
            dataSeedService.importSeedData();
            return ResponseEntity.ok("✅ Import seed data thành công");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("❌ Import seed data thất bại: " + e.getMessage());
        }
    }
}

