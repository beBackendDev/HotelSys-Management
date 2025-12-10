package com.thoaidev.bookinghotel.model.room.dto.response;

import java.util.List;

import com.thoaidev.bookinghotel.model.room.dto.RoomDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {

    private List<RoomDto> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPage;
    private boolean last;
}
