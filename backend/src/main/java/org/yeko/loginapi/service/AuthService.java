package org.yeko.loginapi.service;

import org.springframework.stereotype.Service;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserJpaRepository;

import java.util.Objects;
import java.util.Optional;


@Service
public class AuthService {
    private final UserJpaRepository urJpa;
    private final PasswordService ps;
    private final JwtService jwtService;


    public AuthService(UserJpaRepository userJpaRepository, PasswordService ps, JwtService jwtService){
        this.urJpa = userJpaRepository;
        this.ps = ps;
        this.jwtService = jwtService;
    }



    public boolean authenticateUser(User user, String userName, String userPin) {

        return user != null
                && Objects.equals(user.getUserName(), userName)
                && ps.matches(userPin, user.getUserPin());
    }


    public Optional<LoginResponse> login(LoginRequest loginRequest){
        Optional<User> userFound = urJpa.findByUserName(loginRequest.getUserName());

        if(userFound.isPresent() ) {
            User user = userFound.get();
            if (authenticateUser(user, loginRequest.getUserName(), loginRequest.getUserPin())) {
                String token = jwtService.generateToken(user);

                return Optional.of( new LoginResponse(
                                                      token,
                                                      user.getUserId(),
                                                      user.getUserName(),
                                                      user.getUserRole()
                                                     )
                );

            }
        }
        return Optional.empty();
    }


    public boolean isRequestHeaderValid(String authorizationHeader){
        return( authorizationHeader != null && authorizationHeader.startsWith("Bearer ") );
    }


    public Optional<String> getValidToken(String authorizationHeader){
        if( isRequestHeaderValid(authorizationHeader) ){
            String token = authorizationHeader.substring(7).trim();

            if(isTokenValid(token)){
                return Optional.of(token);
            }
        }

        return Optional.empty();
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


    public Optional<String> getUserRole(String authorizationHeader){
        Optional<String> token = getValidToken(authorizationHeader);

        if (token.isPresent() ){
            Long id = extractUserId(token.get());
            return urJpa.findById(id).map(User::getUserRole);
        }

        return Optional.empty();
    }


    public boolean isAccountOwner(String authorizationHeader, Long id){
        Optional<String> token = getValidToken(authorizationHeader);

        if (token.isPresent() ){
            return Objects.equals(extractUserId(token.get()), id);
        }

        return false;
    }


    public boolean isAdmin(String authorizationHeader){
        Optional<String> role = getUserRole(authorizationHeader);

        if(role.isPresent()){
            return Objects.equals(role.get(), "ADMIN");
        }
        return false;
    }


    public boolean isUser(String authorizationHeader){
        Optional<String> role = getUserRole(authorizationHeader);

        if(role.isPresent()){
            return Objects.equals(role.get(), "USER");
        }
        return false;
    }


}
