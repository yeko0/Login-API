package org.yeko.loginapi.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.yeko.loginapi.dto.CreateUserRequest;
import org.yeko.loginapi.dto.UpdatePinRequest;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private final UserRepository userRepo = Mockito.mock(UserRepository.class);
    private final PasswordService passService = Mockito.mock(PasswordService.class);
    private final AuthService authService = Mockito.mock(AuthService.class);
    private final UserService userService = new UserService(userRepo, passService, authService);


    @Test
    void createUserWithValidData() {
        Long userId = 1L;
        String userName = "testName";
        String userPin = "testPin";
        String userRole = "USER";
        String hashedPin = "hashedPin";

        CreateUserRequest request = new CreateUserRequest(userName, userPin);
        User savedUser = new User(userId, userName, hashedPin, userRole);

        when(passService.hash(userPin))
                .thenReturn(hashedPin);

        when(userRepo.save(any(User.class)))
                .thenReturn(savedUser);

        UserResponse result = userService.createUser(request);
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        verify(passService).hash(userPin);
        verify(userRepo).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();

        assertEquals(userName, capturedUser.getUserName());
        assertEquals(hashedPin, capturedUser.getUserPin());
        assertEquals(userRole, capturedUser.getUserRole());
        assertNull(capturedUser.getUserId());

        assertEquals(userId, result.getUserId());
        assertEquals(userName, result.getUserName());
        assertEquals(userRole, result.getUserRole());
    }


    @Test
    void updatePinWithValidData() {
        Long userId = 1L;
        String userName = "testName";
        String userPin = "testPin";
        String newUserPin = "newPin";
        String hashedPin = "hashedPin";
        String newHashedPin = "newHashedPin";

        User userFound = new User(userId, userName, hashedPin, "USER");
        UpdatePinRequest request = new UpdatePinRequest(userName, userPin, newUserPin);

        when(authService.authenticateUser(userFound, userName, userPin))
                .thenReturn(true);

        when(passService.hash(newUserPin))
                .thenReturn(newHashedPin);

        when(userRepo.findById(userId))
                .thenReturn(Optional.of(userFound));

        boolean result = userService.updatePinIfAuthenticated(request, userId);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        verify(userRepo).save(userCaptor.capture());

        User capturedUser = userCaptor.getValue();

        assertTrue(result);
        assertEquals(newHashedPin, capturedUser.getUserPin());
        verify(authService).authenticateUser(userFound, userName, userPin);
        verify(passService).hash(newUserPin);
    }


}
