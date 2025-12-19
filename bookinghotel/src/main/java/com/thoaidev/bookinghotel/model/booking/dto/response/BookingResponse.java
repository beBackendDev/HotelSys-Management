package com.thoaidev.bookinghotel.model.booking.dto.response;

import java.util.List;

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;

import lombok.Data;
import lombok.NoArgsConstructor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookingResponse {
    private List<BookingDTO> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPage;
    private boolean last;
}
