package com.thoaidev.bookinghotel.model.user.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.mapper.BookingMapper;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;
import com.thoaidev.bookinghotel.model.review.mapper.ReviewMapper;
import com.thoaidev.bookinghotel.model.role.Role;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class UserMapper {
    @Autowired
    private final BookingMapper bookingMapper;
    
    @Autowired
    private final ReviewMapper reviewMapper;

    public UserDto mapToUserDto(UserEntity user) {
        String roleName = user.getRoles()
                .stream()
                .findFirst()
                .map(Role::getRoleName)
                .orElse(null);

        List<BookingDTO> bookingList = user.getBookings().stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());

        List<HotelReviewDTO> reviewList = user.getReviews().stream()
                .map(reviewMapper::toDTO)
                .collect(Collectors.toList());

        UserDto userDto = UserDto
                .builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .fullname(user.getFullname())
                .password(user.getPassword())
                .roleName(roleName)
                .phone(user.getUserPhone())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .urlImg(user.getImgUrl())
                .bookings(bookingList)
                .reviews(reviewList)

                //OWNER
                .ownerRequestStatus(user.getOwnerRequestStatus())
                .businessLicenseNumber(user.getBusinessLicenseNumber())
                .experienceInHospitality(user.getExperienceInHospitality())
                .ownerDescription(user.getOwnerDescription())
                
                .build();
                System.out.println("dto logo: "+ userDto.getOwnerRequestStatus());

        return userDto;
    }

}
