package com.thoaidev.bookinghotel.data.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class SeedData {
    private List<HotelSeedDto> hotels = new ArrayList<>();;
}