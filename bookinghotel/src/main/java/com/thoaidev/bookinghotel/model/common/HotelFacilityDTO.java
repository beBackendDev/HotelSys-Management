package com.thoaidev.bookinghotel.model.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HotelFacilityDTO {
    private Integer id;
    private String icon;
    private String name;

}
