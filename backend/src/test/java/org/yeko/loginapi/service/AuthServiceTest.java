package org.yeko.loginapi.service;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AuthServiceTest {

    private final UserRepository userRepo = Mockito.mock(UserRepository.class);
    private final PasswordService passService = Mockito.mock(PasswordService.class);
    private final JwtService jwtService = Mockito.mock(JwtService.class);
    private final AuthService authService = new AuthService(userRepo, passService, jwtService);


    @Test
    void loginShouldReturnResponse() {

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


}
