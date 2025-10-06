package com.thoaidev.bookinghotel.security.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTGenerator tokenGenerator;
    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        //kiểm tra nếu url là /api/auth hoặc /api/user/public thì bỏ qua bước kiểm tra
        if (path.startsWith("/api/auth/") || path.startsWith("/api/user/public/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getJWTFromRequest(request);
        System.out.println("this JWTAuthenticationFilter");
        System.out.println("==println(JWTAuthenticationFilter)TOKEN >>> " + token);

        if (StringUtils.hasText(token)) {
            if (tokenGenerator.validateToken(token)) {
                String username = tokenGenerator.getUsernameFromJWT(token);

                CustomUserDetail userDetails = (CustomUserDetail) customUserDetailService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                usernamePasswordAuthenticationToken.setDetails((new WebAuthenticationDetailsSource().buildDetails(request)));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                System.out.println("JWT token is invalid or expired, skipping auth setup.");
                // KHÔNG set auth → tiếp tục flow cho phép filterChain đi tiếp
            }

        }
        filterChain.doFilter(request, response);
    }

    private String getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(SecurityConstant.AUTHORIZATION_HEADER);
        System.out.println("==println(JWTAuthenticationFilter) Authorization Header: " + bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SecurityConstant.AUTHORIZATION_PREFIX)) {
            return bearerToken.substring(7, bearerToken.length());
        }
        return null;
    }
}
