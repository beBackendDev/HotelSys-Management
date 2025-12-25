package com.thoaidev.bookinghotel.model.user.service;

import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.model.role.OwnerResponseDTO;
import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.request.ChangePasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ForgetPwRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.OwnerRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.ResetPasswordRequest;
import com.thoaidev.bookinghotel.model.user.dto.request.UserUpdateRequest;
import com.thoaidev.bookinghotel.model.user.dto.response.UserResponse;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

public interface UserService {

//GET methods
    public UserEntity findByUsername(String username);

    UserResponse getAllUser(int pageNo, int pageSize);

    UserDto getUserById(Integer userId);
//POST methods

    String uploadUserAvatar(Integer userId, MultipartFile file);
    public UserEntity updateOnwerRequest(Integer userId, OwnerRequest ownerRequest);
//PUT methods

    UserDto updateUser(UserDto userDto, Integer userId);

    void updateRole(Integer userId, String decision);

    UserDto updateProfile(Integer userId, UserUpdateRequest request);

    void changePassword(Integer userId, ChangePasswordRequest request);

    void sendResetPasswordCode(ForgetPwRequest rq);

    void resetPasswordWithCode(ResetPasswordRequest request);
//DELETE methods

    void deleteUserById(Integer userId);
    public Integer findOwnerIdByUsername(String username) ;
// other methods

    // public UserDto mapToUserDto(UserEntity user);

}
