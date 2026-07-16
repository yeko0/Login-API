package org.yeko.loginapi.service;

import org.junit.jupiter.api.Test;
import org.yeko.loginapi.entity.User;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private final String testSecret = "this-is-a-long-secret-key-only-for-jwt-tests-123";

    private final long tokenTestDuration = 60_000L;

    private final JwtService jwtService = new JwtService(testSecret, tokenTestDuration);


    @Test
    void generateValidToken() {

        Long userId = 1L;
        String userName = "testName";
        User user = new User(userId, userName);

        String token = jwtService.generateToken(user);

        assertNotNull(token);
        assertFalse(token.isBlank());
        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void extractUserDataFromToken() {

        Long userId = 1L;
        String userName = "testName";
        User user = new User(userId, userName);

        String token = jwtService.generateToken(user);

        assertEquals(userId, jwtService.extractUserId(token));
        assertEquals(userName, jwtService.extractUserName(token));
    }


    @Test
    void invalidTokenReturnsFalse() {
        String token = "invalid-token-123";
        assertFalse(jwtService.isTokenValid(token));
    }


    @Test
    void tokenSignedWithDifferentKeyReturnsFalse() {

        Long userId = 1L;
        String userName = "testName";
        User user = new User(userId, userName);

        JwtService anotherJwtService =
                new JwtService("this-is-a-different-secret-key-only-for-jwt-tests-123", tokenTestDuration);

        String token = anotherJwtService.generateToken(user);

        assertFalse(jwtService.isTokenValid(token));
    }


    @Test
    void tokenExpiredReturnsFalse() {
        Long userId = 1L;
        String userName = "testName";
        User user = new User(userId, userName);

        JwtService expiredJwtService =
                new JwtService(testSecret, -1_000L);

        String token = expiredJwtService.generateToken(user);

        assertFalse(jwtService.isTokenValid(token));
    }

}
