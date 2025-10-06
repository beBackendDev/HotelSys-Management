package com.thoaidev.bookinghotel.controller;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thoaidev.bookinghotel.dto.AuthResponseDto;
import com.thoaidev.bookinghotel.model.role.Role;
import com.thoaidev.bookinghotel.model.role.RoleRepository;
import com.thoaidev.bookinghotel.model.token.RefreshToken;
import com.thoaidev.bookinghotel.model.token.RefreshTokenService;
import com.thoaidev.bookinghotel.model.token.TokenRefreshResponse;
import com.thoaidev.bookinghotel.model.user.dto.LoginDto;
import com.thoaidev.bookinghotel.model.user.dto.RegisterDto;
import com.thoaidev.bookinghotel.model.user.dto.request.TokenRefreshRequest;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;
import com.thoaidev.bookinghotel.security.jwt.CustomUserDetail;
import com.thoaidev.bookinghotel.security.jwt.JWTGenerator;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTGenerator jwtGenerator;
    private final RefreshTokenService refreshTokenService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            UserRepository userRepository,
            RoleRepository roleRepository,
            JWTGenerator jwtGenerator,
            RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtGenerator = jwtGenerator;
        this.refreshTokenService = refreshTokenService;

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        try {
            System.out.println("Username: " + loginDto.getUsername());
            System.out.println("Password: " + loginDto.getPassword());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(),
                            loginDto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtGenerator.generateToken(authentication);

            // Lấy user hiện tại từ Authentication object
            CustomUserDetail userDetails = (CustomUserDetail) authentication.getPrincipal();

            Integer id = userDetails.getId();
            String username = userDetails.getUsername(); // hoặc getEmail()
            String roleName = userDetails.getRoleName();
            // String refreshToken = jwtGenerator.generateRefreshToken(userDetails);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(id);
            return new ResponseEntity<>(new AuthResponseDto(token, refreshToken.getToken(), id, username, roleName), HttpStatus.OK);
        } catch (Exception ex) {
            System.out.println(">>>>> Error in login: " + ex.getMessage());
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            return new ResponseEntity<>("Tên người dùng đã tồn tại!", HttpStatus.BAD_REQUEST);
        }

        UserEntity user = new UserEntity();
        user.setFullname(registerDto.getFullname());
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));// Mã hóa password

        Optional<Role> roleOptional = roleRepository.findByRoleName("USER");
        if (roleOptional.isEmpty()) {
            return new ResponseEntity<>("Không tìm thấy vai trò USER", HttpStatus.BAD_REQUEST);
        }
        Role role = roleOptional.get();
        user.setRoles(Collections.singleton(role));

        userRepository.save(user);
        return new ResponseEntity<>("Đăng ký người dùng mới thành công!!", HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        System.out.println("===> REFRESH API CALLED");
        String requestRefreshToken = request.getRefreshToken();

        Optional<RefreshToken> refreshTokenOptional = refreshTokenService.findByToken(requestRefreshToken);

        if (refreshTokenOptional.isPresent()) {
            RefreshToken refreshToken = refreshTokenOptional.get();
            try {
                refreshTokenService.verifyExpiration(refreshToken);
                UserEntity user = refreshToken.getUser();
                String token = jwtGenerator.generateTokenFromUsername(user.getUsername());

                return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
            } catch (Exception ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "error", "RefreshTokenExpired",
                        "message", "Refresh token đã hết hạn. Vui lòng đăng nhập lại!"
                ));
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Refresh token không hợp lệ!");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        refreshTokenService.deleteByToken(requestRefreshToken);
        return ResponseEntity.ok(Map.of(
                "message", "Đăng xuất thành công!"
        ));
    }

}
