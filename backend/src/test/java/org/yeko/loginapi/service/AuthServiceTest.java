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
        String rawPin = "1234";
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
        String wrongPin = "1234";
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
        verify(jwtService, never()).generateToken(userTest);

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
    void returnsTrueForAdmin() {
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
    void returnsFalseForNonAdmin() {
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

        boolean result = authService.isAdmin(authorizationHeader);

        assertFalse(result);
        verify(jwtService).isTokenValid(token);
        verify(jwtService).extractUserId(token);
        verify(userRepo).findPublicUserById(tokenId);
    }


}
