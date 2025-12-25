package com.thoaidev.bookinghotel.model.notification.custom;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

public class UserHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        Integer ownerId = (Integer) attributes.get("ownerId");

        return () -> ownerId.toString(); // ✅ Principal.getName()
    }
}