package com.thoaidev.bookinghotel.model.token;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser(UserEntity user);

    boolean existsByUser_UserId(Integer userId);

    void deleteByUser_UserId(Integer userId);
}
