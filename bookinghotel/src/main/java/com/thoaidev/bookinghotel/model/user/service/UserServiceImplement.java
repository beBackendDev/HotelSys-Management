package com.thoaidev.bookinghotel.model.user.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.dto.OtpData;
import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.booking.dto.BookingDTO;
import com.thoaidev.bookinghotel.model.booking.mapper.BookingMapper;
import com.thoaidev.bookinghotel.model.hotel.entity.HotelReviewDTO;
import com.thoaidev.bookinghotel.model.review.mapper.ReviewMapper;
import com.thoaidev.bookinghotel.model.role.Role;
import com.thoaidev.bookinghotel.model.role.RoleRepository;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.request.ChangePasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ResetPasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.UserUpdateRequest;
import com.thoaidev.bookinghotel.model.user.dto.response.UserResponse;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImplement implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private BookingMapper bookingMapper;
    @Autowired
    private ReviewMapper reviewMapper;
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();


    /*
    ------------THAO TÁC VỚI NGƯỜI DÙNG ------------
     */
    @Override
    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username));
    }
//DUYỆT TÁT CẢ CÁC USER 

    @Override
    public UserResponse getAllUser(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<UserEntity> users = userRepository.findAll(pageable);
        List<UserEntity> listOfUsers = users.getContent();
        List<UserDto> content = listOfUsers.stream().map((user) -> mapToUserDto(user)).collect(Collectors.toList());
        UserResponse userResponse = new UserResponse();
        userResponse.setContent(content);
        userResponse.setPageNo(users.getNumber());
        userResponse.setPageSize(users.getSize());
        userResponse.setTotalElements(users.getTotalElements());
        userResponse.setTotalPage(users.getTotalPages());
        userResponse.setLast(users.isLast());

        return userResponse;
    }
//DUYỆT TỪNG USER THÔNG QUA ID

    @Override
    public UserDto getUserById(Integer userId) {
        UserEntity user = userRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("Đối tượng User không tồn tại"));
        return mapToUserDto(user);
    }
//CẬP NHẬP THÔNG TIN NGƯỜI DÙNG

    @Override
    public UserDto updateUser(UserDto userDto, Integer userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Đối tượng User không tồn tại"));
        if (userDto.getFullname() != null) {
            user.setFullname(userDto.getFullname());

        }
        if (userDto.getPhone() != null) {
            user.setUserPhone(userDto.getPhone());

        }
        if (userDto.getUrlImg() != null) {
            user.setImgUrl(userDto.getUrlImg());

        }
        if (userDto.getGender() != null) {
            user.setGender(userDto.getGender());

        }
        if (userDto.getBirthday() != null) {
            user.setBirthday(userDto.getBirthday());

        }

        UserEntity updatedUser = userRepository.save(user);
        return mapToUserDto(updatedUser);
    }
//CẬP NHẬP PROFILE CỦA NGƯỜI DÙNG(  NGƯỜI DÙNG TỰ THỨC HIỆN)

    @Override
    public UserDto updateProfile(Integer userId, UserUpdateRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullname() != null) {
            user.setFullname(request.getFullname());
        }
        if (request.getPhone() != null) {
            user.setUserPhone(request.getPhone());
        }
        if (request.getImgUrl() != null) {
            user.setImgUrl(request.getImgUrl());
        }
        if (request.getBirthday() != null) {
            user.setBirthday(request.getBirthday());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }

        user.setUpdateAt(LocalDateTime.now());

        UserEntity updatedUser = userRepository.save(user);

        return mapToUserDto(updatedUser);
    }

//ĐỔI PASSWORD
    @Override
    public void changePassword(Integer userId, ChangePasswordRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
// send request OTP 
// Tạm lưu OTP và thời gian hết hạn

//GỬI MÃ XÁC THỰC VÀO MAIL ĐỂ ĐỔI MẬT KHẨU
    @Override
    public void sendResetPasswordCode(String email) {
        UserEntity user = userRepository.findByUsername(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // OTP 6 chữ số
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5); // Hết hạn sau 5 phút

        otpStorage.put(user.getUsername(), new OtpData(otp, expiresAt));

        sendOtpEmail(user.getUsername(), otp);
    }

    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset your password");
        message.setText("Your reset code is: " + otp + "\nIt expires in 5 minutes.");

        mailSender.send(message);
    }

//
    @Override
    public void resetPasswordWithCode(ResetPasswordRequest request) {
        OtpData otpData = otpStorage.get(request.getEmail());
        System.out.println(">>>>Mail:" + otpData);
        if (otpData == null || !otpData.getOtpCode().equals(request.getOtpCode())) {
            throw new IllegalArgumentException("Invalid or expired OTP.");
        }

        if (otpData.getExpirationTime().isBefore(LocalDateTime.now())) {
            otpStorage.remove(request.getEmail());
            throw new IllegalArgumentException("OTP has expired.");
        }

        UserEntity user = userRepository.findByUsername(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        // Mã hoá mật khẩu mới
        String encodedPassword = new BCryptPasswordEncoder().encode(request.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        otpStorage.remove(request.getEmail()); // Xoá OTP sau khi dùng
    }

    /*------------------------ ------------------------------------*/
//
    // Inner class để lưu OTP + thời hạn
    // private static class OtpData {
    //     private final String code;
    //     private final LocalDateTime expiresAt;
    //     public OtpData(String code, LocalDateTime expiresAt) {
    //         this.code = code;
    //         this.expiresAt = expiresAt;
    //     }
    //     public String getCode() {
    //         return code;
    //     }
    //     public LocalDateTime getExpiresAt() {
    //         return expiresAt;
    //     }
    // }
//
    @Override
    public void updateRole(Integer userId, String roleName) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Đối tượng User không tồn tại"));

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new NotFoundException("Đối tượng Role không tồn tại"));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        UserEntity updatedUser = userRepository.save(user);

    }
//

    @Override
    @Transactional
    public void deleteUserById(Integer userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Đối tượng User không tồn tại"));

        // Xóa quan hệ với role
        user.getRoles().clear();           // clear Set<Role>
        userRepository.save(user);         // update để gỡ liên kết

        userRepository.delete(user);
    }
//

    //_____________Other Methods_____________
    @Override
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
                .build();

        return userDto;
    }

}
