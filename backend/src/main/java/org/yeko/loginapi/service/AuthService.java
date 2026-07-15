package org.yeko.loginapi.service;

import org.springframework.stereotype.Service;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.Objects;
import java.util.Optional;


@Service
public class AuthService {
    private static final String ROLE_USER = "USER";
    private static final String ROLE_ADMIN = "ADMIN";

    private final UserRepository ur;
    private final PasswordService ps;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordService ps, JwtService jwtService){
        this.ur = userRepository;
        this.ps = ps;
        this.jwtService = jwtService;
    }



    public boolean authenticateUser(User user, String userName, String userPin) {

        return user != null
                && Objects.equals(user.getUserName(), userName)
                && ps.matches(userPin, user.getUserPin());
    }


    public Optional<LoginResponse> login(LoginRequest loginRequest){
        Optional<User> userFound = ur.findByUserName(loginRequest.getUserName());

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

            if(!token.isBlank() && isTokenValid(token)){
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
            return ur.findPublicUserById(id).map(UserResponse::getUserRole);
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
            return Objects.equals(role.get(), ROLE_ADMIN);
        }
        return false;
    }


    public boolean isUser(String authorizationHeader){
        Optional<String> role = getUserRole(authorizationHeader);

        if(role.isPresent()){
            return Objects.equals(role.get(), ROLE_USER);
        }
        return false;
    }


}
