package com.thoaidev.bookinghotel.model.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomFacilityDTO {
    private Integer id;
    private String icon;
    private String name;

}
