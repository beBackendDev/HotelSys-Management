package com.thoaidev.bookinghotel.model.user.dto.request;

import lombok.Data;

@Data
public class OwnerRequest {

    private String businessLicenseNumber; //Giấy phép kinh doanh
    private Integer experienceInHospitality;// Kinh nghiệm trong F&B
    private String ownerDescription; //Mô tả về chủ sở hữu
}
