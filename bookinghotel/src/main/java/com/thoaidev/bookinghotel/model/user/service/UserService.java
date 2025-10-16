package com.thoaidev.bookinghotel.model.user.service;

import org.springframework.web.multipart.MultipartFile;

import com.thoaidev.bookinghotel.model.user.dto.UserDto;
import com.thoaidev.bookinghotel.model.user.dto.request.ChangePasswordRequest;
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
//PUT methods

    UserDto updateUser(UserDto userDto, Integer userId);

    void updateRole(Integer userId, String roleName);

    UserDto updateProfile(Integer userId, UserUpdateRequest request);

    void changePassword(Integer userId, ChangePasswordRequest request);

    void sendResetPasswordCode(String email);

    void resetPasswordWithCode(ResetPasswordRequest request);
//DELETE methods

    void deleteUserById(Integer userId);
// other methods

    public UserDto mapToUserDto(UserEntity user);

}
