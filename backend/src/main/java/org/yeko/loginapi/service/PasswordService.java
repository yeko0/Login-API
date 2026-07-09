package org.yeko.loginapi.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private final PasswordEncoder passwordEncoder;

    public PasswordService(PasswordEncoder passwordEncoder){
        this.passwordEncoder = passwordEncoder;
    }

    public String hash(String rawPin){
        return passwordEncoder.encode(rawPin);
    }

    public boolean matches(String rawPin, String hashedPin){
        return passwordEncoder.matches(rawPin, hashedPin);
    }


}
