package com.thoaidev.bookinghotel.security.jwt;

import java.util.Date;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JWTGenerator {
    // Access Token từ Authentication (dùng cho login)

    public String generateToken(Authentication authentication) {
        System.out.println("this JWTGenerator");
        CustomUserDetail customUserDetail = (CustomUserDetail) authentication.getPrincipal();

        String username = customUserDetail.getUsername();
        Integer userId = customUserDetail.getId();
        String role = customUserDetail.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("USER");

        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstant.JWT_EXPIRATION);

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .claim("userId", userId)
                .claim("userName", username)
                .claim("role", role)
                .signWith(SecurityConstant.JWT_SECRET, SignatureAlgorithm.HS512)
                .compact();
        System.out.println("New token :");
        System.out.println(token);
        return token;
    }

    // Trích xuất username từ token
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SecurityConstant.JWT_SECRET)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Xác thực token có hợp lệ không
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SecurityConstant.JWT_SECRET)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            throw new AuthenticationCredentialsNotFoundException("Mã Token đã tồi tại hoặc không hợp lệ");

        }
    }
    // Tạo refresh token khi login thành công

    public String generateRefreshToken(CustomUserDetail userDetails) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstant.REFRESH_TOKEN_EXPIRATION); // ví dụ 7 ngày

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .claim("userId", userDetails.getId())
                .claim("userName", userDetails.getUsername())
                .signWith(SecurityConstant.JWT_SECRET, SignatureAlgorithm.HS512)
                .compact();
    }
    // Dự phòng nếu bạn có UserDetails object

    public String generateTokenFromUserDetails(UserDetails userDetails) {
        CustomUserDetail user = (CustomUserDetail) userDetails;
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstant.JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .claim("userId", user.getId())
                .claim("role", user.getRoleName())
                .signWith(SecurityConstant.JWT_SECRET, SignatureAlgorithm.HS512)
                .compact();
    }
    // Dùng cho /refresh - từ username tạo access token mới

    public String generateTokenFromUsername(String username) {
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstant.JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                // Có thể thêm claim nếu cần, ví dụ userId, role, nhưng với username thì bạn phải truy vấn database để lấy info
                .signWith(SecurityConstant.JWT_SECRET, SignatureAlgorithm.HS512)
                .compact();
    }

}
