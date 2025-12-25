package com.thoaidev.bookinghotel.model.notification.custom;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.thoaidev.bookinghotel.model.user.service.UserService;
import com.thoaidev.bookinghotel.security.jwt.JWTGenerator;
import com.thoaidev.bookinghotel.security.jwt.SecurityConstant;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JWTGenerator jwtGenerator;
    private final UserService userService;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        String token = extractToken(request);
        String username = jwtGenerator.getUsernameFromJWT(token);

        Integer ownerId = userService.findOwnerIdByUsername(username);

        attributes.put("ownerId", ownerId);
        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }

private String extractToken(ServerHttpRequest request) {

    // 1. Ưu tiên Authorization header
    if (request.getHeaders().containsKey("Authorization")) {
        String authHeader = request.getHeaders()
                .getFirst("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
    }

    // 2. Fallback: token trong query param (SockJS)
    String query = request.getURI().getQuery();
    if (query != null && query.contains("token=")) {
        for (String param : query.split("&")) {
            if (param.startsWith("token=")) {
                return param.substring(6);
            }
        }
    }

    throw new RuntimeException("JWT token not found in WebSocket handshake");
}

}
