package com.thoaidev.bookinghotel.security.jwt;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.thoaidev.bookinghotel.model.role.Role;
import com.thoaidev.bookinghotel.model.user.entity.UserEntity;
import com.thoaidev.bookinghotel.model.user.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("UserName khoong được tìm thấy"));
        System.out.println("==println(CustomUserDetailService)LOAD USER FROM DB: " + user.getUsername());
        System.out.println("==println(CustomUserDetailService)PASSWORD HASH: " + user.getPassword());
        
        String roleName = user.getRoles()
                      .stream()
                      .findFirst()
                      .map(Role::getRoleName)
                      .orElse(null);
        return new CustomUserDetail(user.getUserId(), user.getUsername(), user.getPassword(), roleName,  mapRolesToAuthoritys(user.getRoles()));
    }

    private Collection<GrantedAuthority> mapRolesToAuthoritys(Set<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getRoleName())).collect(Collectors.toList());
    }
}
