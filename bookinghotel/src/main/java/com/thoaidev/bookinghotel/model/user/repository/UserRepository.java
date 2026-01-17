package com.thoaidev.bookinghotel.model.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thoaidev.bookinghotel.model.user.entity.UserEntity;

public interface  UserRepository extends JpaRepository<UserEntity, Integer>{
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByUserId(Integer userId);
    Boolean existsByUsername(String username);

        //DASHBOARD tính tổng số khách sạn của admin

    @Query("""
        SELECT COUNT(u.userId)
        FROM UserEntity u
     
""")
    Integer countAllUsers();

        //DASHBOARD tính tổng số khách sạn của admin

@Query("""
    SELECT COUNT(DISTINCT u.userId)
    FROM UserEntity u
    JOIN u.roles r
    WHERE r.roleName = :roleName
""")
Integer countUsersByRole(@Param("roleName") String roleName);

}
