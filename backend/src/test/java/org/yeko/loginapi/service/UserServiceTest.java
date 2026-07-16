package org.yeko.loginapi.service;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.exception.ForbiddenException;
import org.yeko.loginapi.exception.ResourceNotFoundException;
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

        userService.updatePinWithValidCredentials(request, userId);

        verify(userRepo).save(userFound);
        assertEquals(newHashedPin, userFound.getUserPin());
        verify(authService).authenticateUser(userFound, userName, userPin);
        verify(passService).hash(newUserPin);
        verify(userRepo).findById(userId);
    }


    @Test
    void updatePinThrowsUserNotFoundException() {
        Long userId = 1L;
        UpdatePinRequest request = new UpdatePinRequest("testName", "testPin", "newPin");

        when(userRepo.findById(userId))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.updatePinWithValidCredentials(request, userId));

        verify(userRepo).findById(userId);
        verifyNoInteractions(authService, passService);
        verify(userRepo, never()).save(any(User.class));
    }


    @Test
    void updatePinThrowsForbiddenException() {
        Long userId = 1L;
        String userName = "wrongName";
        String userPin = "wrongPin";
        String newUserPin = "newPin";
        String hashedPin = "hashedPin";

        User user = new User(userId, "realName", hashedPin, "USER");
        UpdatePinRequest request = new UpdatePinRequest(userName, userPin, newUserPin);

        when(userRepo.findById(userId))
                .thenReturn(Optional.of(user));

        when(authService.authenticateUser(user, userName, userPin))
                .thenReturn(false);

        assertThrows(ForbiddenException.class,
                () -> userService.updatePinWithValidCredentials(request, userId));

        verify(userRepo).findById(userId);
        verify(authService).authenticateUser(user, userName, userPin);
        verifyNoInteractions(passService);
        verify(userRepo, never()).save(any(User.class));
    }


    @Test
    void deleteUserWithValidData() {
        Long userId = 1L;
        String userName = "testName";
        String userPin = "testPin";
        DeleteUserRequest request = new DeleteUserRequest(userName, userPin);
        User userFound = new User(userId, userName, "hashedPin", "USER");

        when(userRepo.findById(userId))
                .thenReturn(Optional.of(userFound));

        when(authService.authenticateUser(userFound, userName, userPin))
                .thenReturn(true);

        userService.deleteUserWithValidCredentials(request, userId);

        verify(userRepo).findById(userId);
        verify(authService).authenticateUser(userFound, userName, userPin);
        verify(userRepo).delete(userFound);
    }


    @Test
    void deleteUserThrowsUserNotFoundException() {
        Long userId = 1L;
        DeleteUserRequest request = new DeleteUserRequest("testName", "testPin");

        when(userRepo.findById(userId))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.deleteUserWithValidCredentials(request, userId));

        verify(userRepo).findById(userId);
        verifyNoInteractions(authService);
        verify(userRepo, never()).delete(any(User.class));
    }


    @Test
    void deleteUserThrowsForbiddenException() {
        Long userId = 1L;
        String userName = "wrongName";
        String userPin = "wrongPin";
        DeleteUserRequest request = new DeleteUserRequest(userName, userPin);
        User userFound = new User(userId, "realName", "hashedPin", "USER");

        when(userRepo.findById(userId))
                .thenReturn(Optional.of(userFound));

        when(authService.authenticateUser(userFound, userName, userPin))
                .thenReturn(false);

        assertThrows(ForbiddenException.class,
                () -> userService.deleteUserWithValidCredentials(request, userId));

        verify(userRepo).findById(userId);
        verify(authService).authenticateUser(userFound, userName, userPin);
        verify(userRepo, never()).delete(any(User.class));
    }


    @Test
    void updateRoleWithValidData() {
        Long userId = 1L;
        String userRoleFormatted = "USER";
        UpdateRoleRequest request = new UpdateRoleRequest(" uSeR  ");
        UserResponse userFound = new UserResponse(userId, "testName", "ADMIN");

        when(userRepo.findPublicUserById(userId))
                .thenReturn(Optional.of(userFound));

        when(userRepo.countByUserRole("ADMIN"))
                .thenReturn(2L);

        when(userRepo.updateUserRoleById(userId, userRoleFormatted))
                .thenReturn(1);

        boolean result = userService.updateIfValidRole(userId, request);

        assertTrue(result);
        verify(userRepo).findPublicUserById(userId);
        verify(userRepo).countByUserRole("ADMIN");
        verify(userRepo).updateUserRoleById(userId, userRoleFormatted);
    }


    @Test
    void updateRoleFailsWithLastAdmin() {
        Long userId = 1L;
        UpdateRoleRequest request = new UpdateRoleRequest(" uSeR  ");
        UserResponse userFound = new UserResponse(userId, "testName", "ADMIN");

        when(userRepo.findPublicUserById(userId))
                .thenReturn(Optional.of(userFound));

        when(userRepo.countByUserRole("ADMIN"))
                .thenReturn(1L);

        boolean result = userService.updateIfValidRole(userId, request);

        assertFalse(result);
        verify(userRepo).findPublicUserById(userId);
        verify(userRepo).countByUserRole("ADMIN");
        verify(userRepo, never()).updateUserRoleById(anyLong(), anyString());
    }


    @Test
    void updateRoleFailsWithInvalidRole() {
        Long userId = 1L;
        UpdateRoleRequest request = new UpdateRoleRequest(" invalid_Role ");

        boolean result = userService.updateIfValidRole(userId, request);

        assertFalse(result);
        verifyNoInteractions(userRepo);
    }


    @Test
    void updateRoleThrowsUserNotFoundException() {
        Long userId = 1L;
        UpdateRoleRequest request = new UpdateRoleRequest(" uSeR  ");

        when(userRepo.findPublicUserById(userId))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.updateIfValidRole(userId, request));

        verify(userRepo).findPublicUserById(userId);
        verify(userRepo, never()).countByUserRole(anyString());
        verify(userRepo, never()).updateUserRoleById(anyLong(), anyString());
    }


    @Test
    void updateRoleFailsWhenNoRowsAffected() {
        Long userId = 1L;
        String userRoleFormatted = "USER";
        UpdateRoleRequest request = new UpdateRoleRequest(" uSeR  ");
        UserResponse userFound = new UserResponse(userId, "testName", "ADMIN");

        when(userRepo.findPublicUserById(userId))
                .thenReturn(Optional.of(userFound));

        when(userRepo.countByUserRole("ADMIN"))
                .thenReturn(2L);

        when(userRepo.updateUserRoleById(userId, userRoleFormatted))
                .thenReturn(0);

        boolean result = userService.updateIfValidRole(userId, request);

        assertFalse(result);
        verify(userRepo).findPublicUserById(userId);
        verify(userRepo).countByUserRole("ADMIN");
        verify(userRepo).updateUserRoleById(userId, userRoleFormatted);
    }

}
