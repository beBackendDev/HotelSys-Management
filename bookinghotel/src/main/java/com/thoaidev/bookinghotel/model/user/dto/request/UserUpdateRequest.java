package com.thoaidev.bookinghotel.model.user.dto.request;

import java.time.LocalDate;

import groovy.transform.builder.Builder;
import lombok.Data;

@Data
@Builder
public class UserUpdateRequest {
    private LocalDate birthday;
    private String fullname;
    private String imgUrl;
    private String phone;
    private Boolean gender;
}
