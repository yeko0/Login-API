package org.yeko.loginapi.service;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    private final UserRepository userRepo = Mockito.mock(UserRepository.class);
    private final PasswordService passService = Mockito.mock(PasswordService.class);
    private final JwtService jwtService = Mockito.mock(JwtService.class);
    private final AuthService authService = new AuthService(userRepo, passService, jwtService);


    @Test
    void loginSucceedsWithValidCredentials() {

        String userName = "yeko";
        String rawPin = "correct pin";
        String storedHash = "stored-hash";
        String userRole = "USER";
        String token = "fake-token-123";

        LoginRequest loginRequest = new LoginRequest(userName, rawPin);

        User userTest = new User(1L, userName, storedHash, userRole);

        when(userRepo.findByUserName(userName))
                .thenReturn(Optional.of(userTest));

        when(passService.matches(rawPin, storedHash))
                .thenReturn(true);

        when(jwtService.generateToken(userTest))
                .thenReturn(token);

        Optional<LoginResponse> result = authService.login(loginRequest);
        assertTrue(result.isPresent());

        LoginResponse loginResponse = result.get();

        assertEquals(token, loginResponse.getToken());
        assertEquals(userName, loginResponse.getUserName());
        assertEquals(userTest.getUserId(), loginResponse.getUserId());
        assertEquals(userTest.getUserRole(), loginResponse.getUserRole());
        verify(jwtService).generateToken(userTest);

    }


    @Test
    void loginFailsWithWrongPin() {

        String userName = "yeko";
        String wrongPin = "wrong pin";
        String storedHash = "stored-hash";
        String userRole = "USER";

        LoginRequest loginRequest = new LoginRequest(userName, wrongPin);

        User userTest = new User(1L, userName, storedHash, userRole);

        when(userRepo.findByUserName(userName))
                .thenReturn(Optional.of(userTest));

        when(passService.matches(wrongPin, storedHash))
                .thenReturn(false);


        Optional<LoginResponse> result = authService.login(loginRequest);

        assertTrue(result.isEmpty());
        verify(jwtService, never()).generateToken(any());

    }


    @Test
    void loginFailsWhenUserNotFound() {
        String wrongUserName = "yyyeko";
        String rawPin = "1234";

        LoginRequest loginRequest = new LoginRequest(wrongUserName, rawPin);

        when(userRepo.findByUserName(wrongUserName))
                .thenReturn(Optional.empty());

        Optional<LoginResponse> result = authService.login(loginRequest);

        verify(passService, never()).matches(any(), any());
        verify(jwtService, never()).generateToken(any());
        assertTrue(result.isEmpty());
    }


    @Test
    void returnsTokenWhenHeaderIsValid() {

        String fakeToken = "fake-token-123";
        String authorizationHeader = "Bearer "+ fakeToken;

        when(jwtService.isTokenValid(fakeToken))
                .thenReturn(true);

        Optional<String> result = authService.getValidToken(authorizationHeader);

        assertTrue(result.isPresent());
        assertEquals(fakeToken, result.get());

    }


    @Test
    void returnsEmptyWhenHeaderNotValid() {

        String fakeToken = "fake-token-123";
        String authorizationHeader = "header "+ fakeToken;

        Optional<String> result = authService.getValidToken(authorizationHeader);

        assertTrue(result.isEmpty());
        verify(jwtService, never()).isTokenValid(anyString());

    }


    @Test
    void returnsEmptyWhenTokenNotValid() {
        String wrongToken = "fake-token-123";
        String authorizationHeader = "Bearer "+ wrongToken;

        when(jwtService.isTokenValid(wrongToken))
                .thenReturn(false);

        Optional<String> result = authService.getValidToken(authorizationHeader);

        assertTrue(result.isEmpty());
        verify(jwtService).isTokenValid(wrongToken);
    }


    @Test
    void returnsEmptyWhenHeaderNotPresent() {

        Optional<String> result = authService.getValidToken(null);

        assertTrue(result.isEmpty());
        verify(jwtService, never()).isTokenValid(anyString());
    }


    @Test
    void returnsEmptyWhenTokenIsBlank() {

        String authorizationHeader = "Bearer ";

        Optional<String> result =
                authService.getValidToken(authorizationHeader);

        assertTrue(result.isEmpty());
        verify(jwtService, never()).isTokenValid(anyString());
    }


    @Test
    void returnsTrueForAccountOwner() {
        Long userId = 1L;
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(userId);

        boolean result = authService.isAccountOwner(authorizationHeader, userId);

        assertTrue(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
    }


    @Test
    void returnsFalseWhenNotAccountOwner() {
        Long tokenUserId = 1L;
        Long requestedUserId = 2L;
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(tokenUserId);

        boolean result = authService.isAccountOwner(authorizationHeader, requestedUserId);

        assertFalse(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
    }


    @Test
    void adminCheckReturnsTrueForAdmin() {
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;
        Long tokenId = 1L;
        String userRole = "ADMIN";
        UserResponse userResponse = new UserResponse(tokenId, "testName", userRole);

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(tokenId);

        when(userRepo.findPublicUserById(tokenId))
                .thenReturn(Optional.of(userResponse));

        boolean result = authService.isAdmin(authorizationHeader);

        assertTrue(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepo).findPublicUserById(tokenId);
    }


    @Test
    void adminCheckReturnsFalseForNonAdmin() {
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;
        Long tokenId = 1L;
        String userRole = "OTHER_ROLE";
        UserResponse userResponse = new UserResponse(tokenId, "testName", userRole);

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(tokenId);

        when(userRepo.findPublicUserById(tokenId))
                .thenReturn(Optional.of(userResponse));

        boolean result = authService.isAdmin(authorizationHeader);

        assertFalse(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepo).findPublicUserById(tokenId);
    }


    @Test
    void adminCheckFailsWhenUserNotFound() {
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;
        Long tokenId = 1L;

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(tokenId);

        when(userRepo.findPublicUserById(tokenId))
                .thenReturn(Optional.empty());

        boolean result = authService.isAdmin(authorizationHeader);

        assertFalse(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepo).findPublicUserById(tokenId);
    }


    @Test
    void adminCheckFailsWhenTokenNotValid() {
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;

        when(jwtService.isTokenValid(token))
                .thenReturn(false);

        boolean result = authService.isAdmin(authorizationHeader);

        assertFalse(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService, never()).extractUserId(anyString());
        verify(userRepo, never()).findPublicUserById(anyLong());
    }


    @Test
    void userCheckReturnsTrueForUser() {
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;
        Long tokenId = 1L;
        String userRole = "USER";
        UserResponse userResponse = new UserResponse(tokenId, "testName", userRole);

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(tokenId);

        when(userRepo.findPublicUserById(tokenId))
                .thenReturn(Optional.of(userResponse));

        boolean result = authService.isUser(authorizationHeader);

        assertTrue(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepo).findPublicUserById(tokenId);
    }


    @Test
    void userCheckReturnsFalseForNonUser() {
        String token = "fake-token-123";
        String authorizationHeader = "Bearer "+ token;
        Long tokenId = 1L;
        String userRole = "OTHER_ROLE";
        UserResponse userResponse = new UserResponse(tokenId, "testName", userRole);

        when(jwtService.isTokenValid(token))
                .thenReturn(true);

        when(jwtService.extractUserId(token))
                .thenReturn(tokenId);

        when(userRepo.findPublicUserById(tokenId))
                .thenReturn(Optional.of(userResponse));

        boolean result = authService.isUser(authorizationHeader);

        assertFalse(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepo).findPublicUserById(tokenId);
    }


    @Test
    void returnsTrueForValidAuthentication() {
        User user = new User("testName", "hashedPin");
        String requestName = "testName";
        String requestPin = "correctPin";

        when(passService.matches(requestPin, user.getUserPin()))
                .thenReturn(true);

        boolean result = authService.authenticateUser(user, requestName, requestPin);

        assertTrue(result);
        verify(passService).matches(requestPin, user.getUserPin());
    }


    @Test
    void authenticateUserFailsWhenUserIsNull() {
        User user = null;
        String requestName = "testName";
        String requestPin = "testPin";

        boolean result = authService.authenticateUser(user, requestName, requestPin);

        assertFalse(result);
        verifyNoInteractions(passService);
    }


    @Test
    void authenticateUserFailsWhenUsersNameDontMatch() {
        User user = new User("testName", "hashedPin");
        String requestName = "differentName";
        String requestPin = "testPin";

        boolean result = authService.authenticateUser(user, requestName, requestPin);

        assertFalse(result);
        verifyNoInteractions(passService);
    }


    @Test
    void authenticateUserFailsWithWrongPin() {
        User user = new User("testName", "hashedPin");
        String requestName = "testName";
        String requestPin = "wrongPin";

        when(passService.matches(requestPin, user.getUserPin()))
                .thenReturn(false);

        boolean result = authService.authenticateUser(user, requestName, requestPin);

        assertFalse(result);
        verify(passService).matches(requestPin, user.getUserPin());
    }


}
