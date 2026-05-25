package org.yeko.loginapi.service;

import org.springframework.stereotype.Service;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.entity.User;
import org.yeko.loginapi.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

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


    public UserResponse createUser(CreateUserRequest request ){

        User user = toUser(request);

        user.setUserPin(ps.hash(request.getUserPin()));

        User userCreated = ur.createUser(user);

        if(userCreated != null){
            return toUserResponse(userCreated);
        }

        return null;
    }


    public boolean updatePinIfAuthenticated(UpdatePinRequest update, Long id ){
        User user = ur.findUserById(id);

        if( user == null || !as.authenticateUser(user, update.getUserName(), update.getUserPin()) ){
            return false;
        }

        user.setUserPin(ps.hash(update.getNewUserPin()));

        return ur.updateUserPin(id, user.getUserPin());
    }


    public UserResponse findPublicUserById(Long id ){
        User user = ur.findPublicUserById(id);

        if (user == null) {
            return null;
        }

        return toUserResponse(user);
    }

    public UserResponse getUserByToken(String authorizationHeader){
        String token = as.getValidToken(authorizationHeader);

        if( token != null ){
            return findPublicUserById(as.extractUserId(token));
        }
        return null;
    }


    public boolean deleteUserIfAuthenticated(DeleteUserRequest deleteRequest, Long id ){
        User user = ur.findUserById(id);

        if (user != null && as.authenticateUser(user, deleteRequest.getUserName(), deleteRequest.getUserPin()) ){
            return ur.deleteUserById(id);
        }

        return false;
    }


    public boolean updateIfValidRole(Long id, UpdateRoleRequest update ){

        String role = update.getUserRole().trim().toUpperCase();
        if( !isValidRole(role) ){
            return false;
        }

        UserResponse user = findPublicUserById(id);
        if( user == null ){
            return false;
        }

        if( isLastAdmin() && "ADMIN".equals(user.getUserRole()) && "USER".equals(role) ){
            return false;
        }
        return ur.updateUserRole(id, role);
    }


}