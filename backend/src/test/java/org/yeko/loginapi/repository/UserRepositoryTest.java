package org.yeko.loginapi.repository;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.entity.User;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EntityManager entityManager;


    @Test
    void findAllPublicUsersReturnsSavedUsers() {

        User user = new User(null, "testName", "hashedPin", "USER");

        userRepo.save(user);

        List<UserResponse> users = userRepo.findAllPublicUsers();

        assertEquals(1, users.size());

        UserResponse result = users.get(0);

        assertNotNull(result.getUserId());
        assertEquals("testName", result.getUserName());
        assertEquals("USER", result.getUserRole());
    }


    @Test
    void findAllPublicUsersReturnsEmptyListWhenNoUsersSaved() {
        List<UserResponse> users = userRepo.findAllPublicUsers();
        assertTrue(users.isEmpty());
    }


    @Test
    void findPublicUserByIdReturnsUser() {
        User createdUser = new User(null, "testName", "hashedPin", "USER");
        User user = userRepo.save(createdUser);

        UserResponse result = userRepo.findPublicUserById(user.getUserId()).orElseThrow();

        assertEquals(user.getUserId(), result.getUserId());
        assertEquals("testName", result.getUserName());
        assertEquals("USER", result.getUserRole());
    }


    @Test
    void findPublicUserByIdReturnsEmptyWithWrongId() {

        User createdUser =
                new User(null, "testName", "hashedPin", "USER");

        User savedUser = userRepo.save(createdUser);

        Long existingId = savedUser.getUserId();
        Long nonExistingId = existingId + 999L;

        Optional<UserResponse> result =
                userRepo.findPublicUserById(nonExistingId);

        assertTrue(result.isEmpty());
    }

    @Test
    void updateUserRoleByIdWithValidId() {
        User createdUser = new User(null, "testName", "hashedPin", "USER");
        User user = userRepo.save(createdUser);

        int result = userRepo.updateUserRoleById(user.getUserId(), "ADMIN");

        entityManager.clear();

        User updatedUser = userRepo.findById(user.getUserId()).orElseThrow();

        assertEquals(1, result);
        assertEquals("ADMIN", updatedUser.getUserRole());
    }


    @Test
    void updateUserRoleByIdWithInvalidId() {
        User createdUser = new User(null, "testName", "hashedPin", "USER");
        User user = userRepo.save(createdUser);

        Long existingId = user.getUserId();
        Long nonExistingId = existingId + 999L;

        int result = userRepo.updateUserRoleById(nonExistingId, "ADMIN");

        entityManager.clear();

        User updatedUser = userRepo.findById(existingId).orElseThrow();

        assertEquals(0, result);
        assertEquals("USER", updatedUser.getUserRole());
    }

}
