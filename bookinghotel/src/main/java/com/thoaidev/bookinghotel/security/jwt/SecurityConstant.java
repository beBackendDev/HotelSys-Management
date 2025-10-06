package com.thoaidev.bookinghotel.security.jwt;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import io.jsonwebtoken.security.Keys;

public class SecurityConstant {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String AUTHORIZATION_PREFIX = "Bearer ";
    // public static final long JWT_EXPIRATION = 5 * 60 * 1000; // 5 phút --> phát triển sau
    public static final long JWT_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 ngày
    public static final long REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 ngày
    public static final String STRING_JWT_SECRET
            = "0f94bcb28156f91f90df883519bf6cb84c0c3523cb20467c61243f35ac1d24dba9ecf2d715b6270daf7e78a39b67d33afce08baab836b2015c3f1ea39575eafd32bb95c49301c7ba082d6d91b0131d21f4490e03f472a3d3f65d27166d69eb4a84c997b62ee866e1450d70e15de6e11c13307488d552f884a341ae7cfb8cfce11402d50d12541a9f7dc67f009bd274d613095f2852bf8dd634237deffc8de6be100a2c41182d8dc78b2ce5c42a67b342732a4e808ab757ae9693c1c57a6a9bdf10679e4e6acb3bd660e6f2a52dd4a1129f95a1d8d895a845cfb7b6d36b652b33d00f83f5150c85fd1f100e3fa2dc088b71f9b299c13da0abdd9913432d2da468"; // bí mật
    public static final SecretKey JWT_SECRET = Keys.hmacShaKeyFor(STRING_JWT_SECRET.getBytes(StandardCharsets.UTF_8));
}
