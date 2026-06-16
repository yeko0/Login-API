package org.yeko.loginapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    boolean existsByUserName(String userName);

    long countByUserRole(String userRole);

    @Query("""
            SELECT new org.yeko.loginapi.dto.UserResponse(
                u.userId,
                u.userName,
                u.userRole
            )
            FROM User u
            """)
    List<UserResponse> findAllPublicUsers();

    @Query("""
            SELECT new org.yeko.loginapi.dto.UserResponse(
                u.userId,
                u.userName,
                u.userRole
            )
            FROM User u
            WHERE u.userId = :id
            """)
    Optional<UserResponse> findPublicUserById(@Param("id") Long id);

    @Modifying
    @Query("""
        UPDATE User u
        SET u.userRole = :role
        WHERE u.userId = :id
        """)
    int updateUserRoleById(@Param("id") Long id, @Param("role") String role);


}