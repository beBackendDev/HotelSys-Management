package com.thoaidev.bookinghotel.model.user.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.thoaidev.bookinghotel.model.booking.entity.Booking;
import com.thoaidev.bookinghotel.model.enums.OwnerRequestStatus;
import com.thoaidev.bookinghotel.model.hotel.entity.Hotel;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReview;
import com.thoaidev.bookinghotel.model.role.Role;

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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
//automatic Email
    @Column(name = "user_name")
    private String username; //Tên người dùng

    @Column(name = "birthday")
    private LocalDate birthday; //Sinh nhật

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "full_name")
    private String fullname;

    @Column(name = "user_pw")
    private String password;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name = "user_phone")
    private String userPhone;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)

    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id",
                    referencedColumnName = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id",
                    referencedColumnName = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelReview> reviews;

    @ManyToMany
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hotel_id")
    )
    private Set<Hotel> favoriteHotels = new HashSet<>();

    //Mở rộng cho role == OWNER
    @Enumerated(EnumType.STRING)
    @Column(name = "owner_request_status")
    private OwnerRequestStatus ownerRequestStatus = OwnerRequestStatus.NONE; //status, auto NONE when User is created

    @Column(name = "business_license_number")
    private String businessLicenseNumber; //Giấy phép kinh doanh

    @Column(name = "experience_in_hospitality")
    private Integer experienceInHospitality;// Kinh nghiệm trong F&B

    @Column(name = "owner_description")
    private String ownerDescription; //Mô tả về chủ sở hữu

    //Một OWNER có thể sở hữu nhiều khách sạn
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hotel> hotels;

}
