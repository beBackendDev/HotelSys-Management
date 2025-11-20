package com.thoaidev.bookinghotel.model.user.service;

import java.io.IOException;
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
import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.dto.OtpData;
import com.thoaidev.bookinghotel.exceptions.NotFoundException;
import com.thoaidev.bookinghotel.model.booking.mapper.BookingMapper;
import com.thoaidev.bookinghotel.model.enums.OwnerRequestStatus;
import com.thoaidev.bookinghotel.model.enums.OwnerResponseStatus;
import com.thoaidev.bookinghotel.model.image.service.ImageService;
import com.thoaidev.bookinghotel.model.review.mapper.ReviewMapper;
import com.thoaidev.bookinghotel.model.role.Role;
import com.thoaidev.bookinghotel.model.role.RoleRepository;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.request.ChangePasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ForgetPwRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.OwnerRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ResetPasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.UserUpdateRequest;
import com.thoaidev.bookinghotel.model.user.dto.response.UserResponse;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.mapper.UserMapper;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserServiceImplement implements UserService {

    @Autowired
    private ImageService imageService;

    private final UserRepository userRepository;
    @Autowired
    private final RoleRepository roleRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JavaMailSender mailSender;
    @Autowired
    private final BookingMapper bookingMapper;
    @Autowired
    private final ReviewMapper reviewMapper;
    @Autowired
    private final UserMapper userMapper;
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    /*
    ------------THAO TÁC VỚI NGƯỜI DÙNG ------------
     */
    @Override
    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username));
    }

//CẬP NHẬT NGƯỜI DÙNG THÀNH OWNER 
    @Override
    public UserEntity updateOnwerRequest(Integer userId, OwnerRequest ownerRequest) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        String roleName = user.getRoles()
                .stream()
                .findFirst()
                .map(Role::getRoleName)
                .orElse(null);
        //Xét role người dùng là USER thì mới thực hiện tác vụ update 
        if (!roleName.equals("USER")) {
            throw new RuntimeException("Only USERs can register as OWNERs");
        }

        //Đăng kí thêm thông tin cho ONWER 
        if (ownerRequest.getBusinessLicenseNumber() != null) {
            user.setBusinessLicenseNumber(ownerRequest.getBusinessLicenseNumber());
        }
        if (ownerRequest.getExperienceInHospitality() != null) {
            user.setExperienceInHospitality(ownerRequest.getExperienceInHospitality());
        }
        if (ownerRequest.getOwnerDescription() != null) {
            user.setOwnerDescription(ownerRequest.getOwnerDescription());
        }
// Cập nhật tình trạng đơn là đang đợi
        user.setOwnerRequestStatus(OwnerRequestStatus.PENDING);
        return userRepository.save(user);

    }
//DUYỆT TÁT CẢ CÁC USER 

    @Override
    public UserResponse getAllUser(int pageNo, int pageSize) {
        int pageIndex = (pageNo <= 0) ? 0 : pageNo - 1; //XU li lech page
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        Page<UserEntity> users = userRepository.findAll(pageable);
        List<UserEntity> listOfUsers = users.getContent();
        List<UserDto> content = listOfUsers
                .stream()
                .map(userMapper::mapToUserDto)
                .collect(Collectors.toList());
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
        return userMapper.mapToUserDto(user);
    }

//UPLOAD HÌNH ẢNH CHO NGƯỜI DÙNG
    @Override
    public String uploadUserAvatar(Integer userId, MultipartFile file) {
        try {
            //Validate file
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Invalid File Input");
            }

            //Validate Image Size 
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("Kích thước ảnh không được vượt quá 5MB");
            }

            //Finding User
            UserEntity user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User didnt Found"));

            //Replace older Image( if have)
            // if (user.getImgUrl() != null && !user.getImgUrl().isEmpty()) {
            //     imageService.delete(user.getImgUrl()); // Xóa file cũ khỏi storage
            // }
            //Upload 
            String avatarUrl = imageService.upload(file, "users/" + userId + "/avatar");
            // Cập nhật user
            user.setImgUrl(avatarUrl);
            userRepository.save(user);

            return avatarUrl;
        } catch (IOException err) {
            throw new RuntimeException("Error upload Avatar: " + err.getMessage(), err);
        }
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

        //role == OWNER 
        String roleName = user.getRoles()
                .stream()
                .findFirst()
                .map(Role::getRoleName)
                .orElse(null);

        System.out.println("Check ROle :" + roleName);

        if (roleName.equals("OWNER")) {
            if (userDto.getBusinessLicenseNumber() != null) {
                user.setBusinessLicenseNumber(userDto.getBusinessLicenseNumber());
            }

            if (userDto.getExperienceInHospitality() != null) {
                user.setExperienceInHospitality(userDto.getExperienceInHospitality());
            }

            if (userDto.getOwnerDescription() != null) {
                user.setOwnerDescription(userDto.getOwnerDescription());
            }
        } else {
            user.setBusinessLicenseNumber(null);
            user.setExperienceInHospitality(null);
            user.setOwnerDescription(null);
        }

        UserEntity updatedUser = userRepository.save(user);
        return userMapper.mapToUserDto(user);
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

        return userMapper.mapToUserDto(user);
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
    public void sendResetPasswordCode(ForgetPwRequest rq) {
        UserEntity user = userRepository.findByUsername(rq.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        //khởi tạo otp để xác thực 
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // OTP 6 chữ số
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(5); // Hết hạn sau 5 phút

        otpStorage.put(user.getUsername(), new OtpData(otp, expiresAt));

        sendOtpEmail(user.getUsername(), otp);
    }
//phương thức thực hiện gửi otp qua mail để thực hiện xác thực 

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
        //Tìm kiếm người dùng thông qua username( email)
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
    public void updateRole(Integer userId, String decision) {

        //Cập nhật role_user == OWNER
        //Cập nhật owner_request_status == APPROVED (chấp thuận)
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not Found"));

        Role role = roleRepository.findByRoleName("OWNER")
                .orElseThrow(() -> new NotFoundException("Đối tượng Role không tồn tại"));
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        //check if admin dicision == APPROVED
        System.out.println("Test decision 1:" + decision);
        System.out.println("Test decision 2:" + OwnerResponseStatus.APPROVED.name());
        if (decision.equals(OwnerResponseStatus.APPROVED.name())) {
            user.setRoles(roles);
            user.setOwnerRequestStatus(OwnerRequestStatus.APPROVED);
        } else {
            user.setOwnerRequestStatus(OwnerRequestStatus.REJECTED);
        }

        //REJECT
        userRepository.save(user);

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
    // @Override
    // public UserDto mapToUserDto(UserEntity user) {
    //     String roleName = user.getRoles()
    //             .stream()
    //             .findFirst()
    //             .map(Role::getRoleName)
    //             .orElse(null);
    //     List<BookingDTO> bookingList = user.getBookings().stream()
    //             .map(bookingMapper::toDTO)
    //             .collect(Collectors.toList());
    //     List<HotelReviewDTO> reviewList = user.getReviews().stream()
    //             .map(reviewMapper::toDTO)
    //             .collect(Collectors.toList());
    //     UserDto userDto = UserDto
    //             .builder()
    //             .userId(user.getUserId())
    //             .username(user.getUsername())
    //             .fullname(user.getFullname())
    //             .password(user.getPassword())
    //             .roleName(roleName)
    //             .phone(user.getUserPhone())
    //             .birthday(user.getBirthday())
    //             .gender(user.getGender())
    //             .urlImg(user.getImgUrl())
    //             .bookings(bookingList)
    //             .reviews(reviewList)
    //             .build();
    //     return userDto;
    // }
}
