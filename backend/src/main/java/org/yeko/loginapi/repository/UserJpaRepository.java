package org.yeko.loginapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.yeko.loginapi.entity.User;

public interface UserJpaRepository extends JpaRepository<User, Long> {
}