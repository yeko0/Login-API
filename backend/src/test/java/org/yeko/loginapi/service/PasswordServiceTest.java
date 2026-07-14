package org.yeko.loginapi.service;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordServiceTest {
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private final PasswordService passService = new PasswordService(encoder);
    private static final String RAW_PIN = "123456";

    @Test
    void hashValidReturnValue() {

        String hashedPin = passService.hash(RAW_PIN);

        assertNotNull(hashedPin);
        assertNotEquals(RAW_PIN, hashedPin);
    }


    @Test
    void matchesShouldReturnTrue() {

        String hashedPin = encoder.encode(RAW_PIN);

        boolean result = passService.matches(RAW_PIN, hashedPin);

        assertTrue(result);
    }


    @Test
    void matchesShouldReturnFalse() {

        String falsePin = "1234567";
        String hashedPin = encoder.encode(RAW_PIN);

        boolean result = passService.matches(falsePin, hashedPin);

        assertFalse(result);
    }

}
