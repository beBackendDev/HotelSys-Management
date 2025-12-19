package com.thoaidev.bookinghotel.model.hotel.dto.response;

import java.util.List;

import com.thoaidev.bookinghotel.model.hotel.dto.HotelDto;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
public class HotelResponse{
    private List<HotelDto> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPage;
    private boolean last;
}
