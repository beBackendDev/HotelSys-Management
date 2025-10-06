package com.thoaidev.bookinghotel.model.token;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.exceptions.TokenRefreshException;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.security.jwt.SecurityConstant;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean existToken(Integer userId) {
        return refreshTokenRepository.existsByUser_UserId(userId);
    }

    public RefreshToken createRefreshToken(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại với id: " + userId));

        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUser(user);

        RefreshToken refreshToken;
        if (existingToken.isPresent()) {
            // Nếu đã có token -> update lại
            refreshToken = existingToken.get();
        } else {
            // Nếu chưa có token -> tạo mới
            refreshToken = new RefreshToken();
            refreshToken.setUser(user);
        }

        // Gán lại token và thời gian hết hạn
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(SecurityConstant.JWT_EXPIRATION));

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token đã hết hạn. Vui lòng đăng nhập lại!");
        }
        return token;
    }

    public int deleteByUserId(Integer userId) {
        refreshTokenRepository.deleteByUser_UserId(userId);
        return 1;
    }

    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
