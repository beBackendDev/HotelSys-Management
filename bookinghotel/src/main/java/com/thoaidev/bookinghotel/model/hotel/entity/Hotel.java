package com.thoaidev.bookinghotel.model.hotel.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.thoaidev.bookinghotel.model.common.HotelFacility;
import com.thoaidev.bookinghotel.model.enums.HotelStatus;
import com.thoaidev.bookinghotel.model.image.entity.Image;
import com.thoaidev.bookinghotel.model.room.entity.Room;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// //Sử dụng @Getter @Setter thay vì @Data bởi vì @Data có thể gây lỗi khi sử dụng JPA
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hotel")
@Data
//Sử dụng class Serializable để đánh dấu một class có thể được chuyển đổi (serialize) thành
// một chuỗi byte và có thể khôi phục (deserialize) về đối tượng Java ban đầu.
public class Hotel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    //Bởi vì thuộc tính Id được AutoIncrement cho nên chúng ta set thuộc annotation là GeneratedValue để server tự động đưa dữ liệu dưới dạng AutoIncrement
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Integer hotelId;//Id khach san

    @Column(name = "hotel_name")
    private String hotelName;//Tên khách sạn

    @Column(name = "hotel_address")
    private String hotelAddress;//Địa chỉ khách sạn

    @Column(name = "hotel_average_price")
    private BigDecimal hotelAveragePrice;//Giá tiền trung bình

    @Enumerated(EnumType.STRING)
    @Column(name = "hotel_status")
    private HotelStatus hotalStatus;//Tình trạng khách sạn( còn hay hết phòng)

    @Column(name = "hotel_contact_mail")
    private String hotelContactMail;//Email liên hệ

    @Column(name = "hotel_contact_phone")
    private String hotelContactPhone;//Sđt liên lạc

    @Column(name = "hotel_description", columnDefinition = "TEXT")
    private String hotelDescription;//Thông tin mô tả

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> hotelImages = new ArrayList<>();

    @Column(name = "hotel_created_at")
    @CreationTimestamp
    private LocalDateTime hotelCreatedAt;//Ngày được tạo

    @Column(name = "hotel_updated_at")
    @UpdateTimestamp
    private LocalDateTime hotelUpdatedAt;//Ngày được nâng cấp

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    @Column(name = "rating_point")
    private Double ratingPoint;//danh gia

    @Column(name = "total_review")
    private Integer totalReview;//danh gia

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelReview> reviews = new ArrayList<>();

    // Quan hệ 1-N với HotelFacility
    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelFacility> facilities = new ArrayList<>();

    //Mở rộng cho role == OWNER
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id") // foreign key
    private UserEntity owner;

}
