package com.thoaidev.bookinghotel.model.common;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "hotel-facility")
@Getter
@Setter
public class HotelFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "icon")
    private String icon;   // Ví dụ: "wifi", "tv", "car"

    @Column(name = "name")
    private String name;   // Ví dụ: "Wi-Fi", "TV", "Chỗ đỗ xe miễn phí"

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

}
