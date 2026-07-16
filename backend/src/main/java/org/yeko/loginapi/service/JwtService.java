package org.yeko.loginapi.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.yeko.loginapi.entity.User;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    private final String secret;
    private final long tokenDurationMillis;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.duration-millis}") long tokenDurationMillis){

        this.secret = secret;
        this.tokenDurationMillis = tokenDurationMillis;
    }


    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }


    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    public String generateToken(User user){
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + tokenDurationMillis);

        return Jwts.builder()
                .subject(user.getUserName())
                .claim("userId", user.getUserId())
                .claim("userName", user.getUserName())
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();

    }


    public String extractUserName(String token){
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token){
        return extractAllClaims(token).get("userId", Long.class);
    }


    public boolean isTokenValid(String token){
        try{
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
