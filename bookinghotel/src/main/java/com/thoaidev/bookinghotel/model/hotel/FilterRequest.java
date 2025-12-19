package com.thoaidev.bookinghotel.model.hotel;
//khong dung
import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class FilterRequest {
    private String name;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String facility;
    private Double rating;
    private String location;
}
