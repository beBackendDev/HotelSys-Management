package com.thoaidev.bookinghotel.model.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDto {
    private String username;
    private String fullname;
    private String businessLicenseNumber; //Giấy phép kinh doanh
    private Integer experienceInHospitality;// Kinh nghiệm trong F&B
    private String ownerDescription;
}
