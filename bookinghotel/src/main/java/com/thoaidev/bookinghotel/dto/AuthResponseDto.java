package com.thoaidev.bookinghotel.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer ";
    private Integer userId;
    private String username;
    private String roleName;

    
    public AuthResponseDto(String accessToken, String refreshToken, Integer id, String username, String roleName) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.userId = id;
        this.username = username;
        this.roleName = roleName;

    }
    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    
}
