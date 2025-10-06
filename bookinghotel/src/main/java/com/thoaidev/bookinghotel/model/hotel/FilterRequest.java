package com.thoaidev.bookinghotel.model.hotel;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FilterRequest {
    private String name;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String facility;
    private Double rating;
    private String location;
}
