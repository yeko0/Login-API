package org.yeko.loginapi.service;

import org.springframework.stereotype.Service;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.ArrayList;
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
        return role.equals("USER")
                || role.equals("ADMIN");
    }


    private boolean isLastAdmin(){
        return ur.countAdmins("ADMIN") == 1;
    }


    public boolean userNameExists(String userName ){
        return ur.userNameExists(userName);
    }



    public List<UserResponse> getAllUsers(){
        List<User> users = ur.getAllUsers();
        List<UserResponse> uRespList = new ArrayList<>();
        for (User u : users){
            uRespList.add(toUserResponse(u));
        }
        return uRespList;
    }


    public Optional<UserResponse> createUser(CreateUserRequest request ){

        User user = toUser(request);

        user.setUserPin(ps.hash(request.getUserPin()));

        Optional<User> userCreated = ur.createUser(user);

        return userCreated.map(this::toUserResponse);

    }


    public boolean updatePinIfAuthenticated(UpdatePinRequest update, Long id ){
        Optional<User> userFound = ur.findUserById(id);

        if( userFound.isPresent() ) {
            User user = userFound.get();

            if (as.authenticateUser(user, update.getUserName(), update.getUserPin())) {
                user.setUserPin(ps.hash(update.getNewUserPin()));
                return ur.updateUserPin(id, user.getUserPin());
            }
        }
        return false;
    }


    public Optional<UserResponse> findPublicUserById(Long id ){
        Optional<User> userFound = ur.findPublicUserById(id);

        return userFound.map(this::toUserResponse);

    }

    public Optional<UserResponse> getUserByToken(String authorizationHeader){
        Optional<String> token = as.getValidToken(authorizationHeader);

        if( token.isPresent() ){
            return findPublicUserById(as.extractUserId(token.get()));
        }
        return Optional.empty();
    }


    public boolean deleteUserIfAuthenticated(DeleteUserRequest deleteRequest, Long id ){
        Optional<User> userFound = ur.findUserById(id);

        if (userFound.isPresent() ){
            User user = userFound.get();

            if(as.authenticateUser(user, deleteRequest.getUserName(), deleteRequest.getUserPin()) ){
                return ur.deleteUserById(id);
            }
        }
        return false;
    }


    public boolean updateIfValidRole(Long id, UpdateRoleRequest update ){

        String role = update.getUserRole().trim().toUpperCase();
        if( isValidRole(role) ){

            Optional<UserResponse> user = findPublicUserById(id);

            if( user.isPresent() ){
                if( !(isLastAdmin() && "ADMIN".equals(user.get().getUserRole()) && "USER".equals(role)) ){
                    return ur.updateUserRole(id, role);
                }
            }
        }

        return false;
    }


}