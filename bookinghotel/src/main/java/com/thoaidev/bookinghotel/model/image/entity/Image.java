package com.thoaidev.bookinghotel.model.image.entity;

import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.room.entity.Room;

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
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;

    private String description;

    // Mỗi ảnh thuộc về một room (hoặc hotel)
    @ManyToOne
    @JoinColumn(name = "room_id")
    @ToString.Exclude
    private Room room;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    @ToString.Exclude
    private Hotel hotel;
}
