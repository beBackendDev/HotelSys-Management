package com.thoaidev.bookinghotel.model.user.dto.response;

import java.util.List;

import com.thoaidev.bookinghotel.model.user.dto.UserDto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserResponse{
    private List<UserDto> content;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPage;
    private boolean last;
}
