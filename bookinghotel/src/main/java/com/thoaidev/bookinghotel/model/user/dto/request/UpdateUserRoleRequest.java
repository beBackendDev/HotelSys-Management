package com.thoaidev.bookinghotel.model.user.dto.request;

import lombok.Data;

@Data
public class UpdateUserRoleRequest {
    private Integer userId;
    private String roleName;

}
