package org.yeko.loginapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.yeko.loginapi.entity.User;

import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    boolean existsByUserName(String userName);

    Long countByUserRole(String userRole);
}