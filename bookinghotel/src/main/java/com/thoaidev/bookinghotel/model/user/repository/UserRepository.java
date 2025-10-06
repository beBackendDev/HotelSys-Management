package com.thoaidev.bookinghotel.model.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

public interface  UserRepository extends JpaRepository<UserEntity, Integer>{
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByUserId(Integer userId);
    Boolean existsByUsername(String username);
}
