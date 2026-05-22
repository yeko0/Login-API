package org.yeko.loginapi.service;

import org.springframework.stereotype.Service;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.Objects;


@Service
public class AuthService {
    private final UserRepository ur;
    private final PasswordService ps;
    private final JwtService jwtService;


    public AuthService(UserRepository ur, PasswordService ps, JwtService jwtService){
        this.ur = ur;
        this.ps = ps;
        this.jwtService = jwtService;
    }



    public boolean authenticateUser(User user, String userName, String userPin) {

        return user != null
                && Objects.equals(user.getUserName(), userName)
                && ps.matches(userPin, user.getUserPin());
    }


    public LoginResponse login(LoginRequest loginRequest){
        User user = ur.findUserByName(loginRequest.getUserName());

        if(user == null || !authenticateUser(user, loginRequest.getUserName(), loginRequest.getUserPin()) ){
            return null;
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token, user.getUserId(), user.getUserName(), user.getUserRole());
    }


    public boolean isRequestHeaderValid(String authorizationHeader){
        return( authorizationHeader != null && authorizationHeader.startsWith("Bearer ") );
    }


    public String getValidToken(String authorizationHeader){
        if( isRequestHeaderValid(authorizationHeader) ){
            String token = authorizationHeader.substring(7).trim();

            if(isTokenValid(token)){
                return token;
            }
        }

        return null;
    }


    public boolean isTokenValid(String token){
        return jwtService.isTokenValid(token);
    }


    public Long extractUserId(String token){
        return jwtService.extractUserId(token);
    }


    public String extractUserName(String token){
        return jwtService.extractUserName(token);
    }


    public String getUserRole(String authorizationHeader){
        String token = getValidToken(authorizationHeader);

        if (token != null ){
            Long id = extractUserId(token);
            return ur.getUserRoleFromDB(id);
        }

        return null;
    }


    public boolean isAccountOwner(String authorizationHeader, Long id){
        String token = getValidToken(authorizationHeader);

        if (token != null ){
            return Objects.equals(extractUserId(token), id);
        }

        return false;
    }


    public boolean isAdmin(String authorizationHeader){
        return Objects.equals(getUserRole(authorizationHeader), "ADMIN");
    }


    public boolean isUser(String authorizationHeader){
        return Objects.equals(getUserRole(authorizationHeader), "USER");
    }


}
