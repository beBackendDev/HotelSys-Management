package com.thoaidev.bookinghotel.model.user.dto.request;

import groovy.transform.builder.Builder;
import lombok.Data;

@Data
@Builder
public class ChangePasswordRequest {
    private String oldPassword;
    private String newPassword;
}
