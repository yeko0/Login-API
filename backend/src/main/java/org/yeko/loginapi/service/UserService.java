package org.yeko.loginapi.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository ur;
    private final PasswordService ps;
    private final AuthService as;

    public UserService(UserRepository userRepository, PasswordService passwordService, AuthService authService) {
        this.ur = userRepository;
        this.ps = passwordService;
        this.as = authService;
    }


    private User toUser(CreateUserRequest jsonBody ){
        return new User(jsonBody.getUserName(), jsonBody.getUserPin() );
    }


    private UserResponse toUserResponse(User user ){
        return new UserResponse(user.getUserId(), user.getUserName(), user.getUserRole());
    }


    private boolean isValidRole(String role ){
        return role.equals("USER") || role.equals("ADMIN");
    }


    private boolean isLastAdmin(){
        return ur.countByUserRole("ADMIN") == 1;
    }


    public boolean userNameExists(String userName ){ return ur.existsByUserName(userName); }


    public List<UserResponse> getAllUsers(){
        return ur.findAllPublicUsers();
    }


    public UserResponse createUser(CreateUserRequest request ){

        User user = toUser(request);

        user.setUserPin(ps.hash(request.getUserPin()));
        user.setUserRole("USER");

        User createdUser = ur.save(user);

        return toUserResponse(createdUser);
    }


    public boolean updatePinIfAuthenticated(UpdatePinRequest update, Long id ){
        Optional<User> userFound = ur.findById(id);

        if( userFound.isPresent() ) {
            User user = userFound.get();

            if (as.authenticateUser(user, update.getUserName(), update.getUserPin())) {
                user.setUserPin(ps.hash(update.getNewUserPin()));
                ur.save(user);
                return true;
            }
        }
        return false;
    }


    public Optional<UserResponse> findPublicUserById(Long id ){ return ur.findPublicUserById(id); }


    public Optional<UserResponse> getUserByToken(String authorizationHeader){
        Optional<String> token = as.getValidToken(authorizationHeader);

        if( token.isPresent() ){
            return findPublicUserById(as.extractUserId(token.get()));
        }
        return Optional.empty();
    }


    public boolean deleteUserIfAuthenticated(DeleteUserRequest deleteRequest, Long id ){
        Optional<User> userFound = ur.findById(id);

        if (userFound.isPresent() ){
            User user = userFound.get();

            if(as.authenticateUser(user, deleteRequest.getUserName(), deleteRequest.getUserPin()) ){
                ur.delete(user);
                return true;
            }
        }
        return false;
    }


    @Transactional
    public boolean updateIfValidRole(Long id, UpdateRoleRequest update ){
        String role = update.getUserRole().trim().toUpperCase();
        if( isValidRole(role) ){

            Optional<UserResponse> foundUser = ur.findPublicUserById(id);

            if( foundUser.isPresent() ) {
                UserResponse user = foundUser.get();
                if (!(isLastAdmin() && "ADMIN".equals(user.getUserRole()) && "USER".equals(role))) {
                    return ur.updateUserRoleById(id, role) == 1;
                }
            }
        }
        return false;
    }


}