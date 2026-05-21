package org.yeko.loginapi.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String hash(String rawPin){
        return encoder.encode(rawPin);
    }

    public boolean matches(String rawPin, String hashedPin){
        return encoder.matches(rawPin, hashedPin);
    }


}
