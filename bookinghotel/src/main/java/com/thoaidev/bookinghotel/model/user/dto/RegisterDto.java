package com.thoaidev.bookinghotel.model.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterDto {

    private String username;

    private String fullname;

    private String password;

}
