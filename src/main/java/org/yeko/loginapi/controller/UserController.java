package org.yeko.loginapi.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.service.AuthService;
import org.yeko.loginapi.service.UserService;

import java.util.List;


@RestController
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService){
        this.userService = userService;
        this.authService = authService;
    }


    @GetMapping("/users")
    public ResponseEntity<?> debugGetAllUsers(){
        List<UserResponse> users = userService.getAllUsers();
        if(users.isEmpty()){
            return ResponseEntity.status(200).body(new ApiMessage("Users Empty"));
        }
        return ResponseEntity.ok(users);
    }


    @GetMapping("/admin/users")
    public ResponseEntity<?> adminGetAllUsers(@RequestHeader(value="Authorization", required=false) String authorizationHeader){
        if(authService.isAdmin(authorizationHeader) ) {

            List<UserResponse> users = userService.getAllUsers();
            if (users.isEmpty()) {
                return ResponseEntity.status(200).body(new ApiMessage("Users Empty"));
            }
            return ResponseEntity.ok(users);
        }
        return ResponseEntity.status(403).body(new ApiMessage("Access Denied"));
    }


    @GetMapping("/users/{id}")
    public ResponseEntity<?> adminGetUserById(@PathVariable Long id,
                                              @RequestHeader(value="Authorization", required=false)
                                                                    String authorizationHeader){

        if( authService.isAdmin(authorizationHeader) ){

            UserResponse ur = userService.findPublicUserById(id);

            if (ur != null) {
                return ResponseEntity.ok(ur);
            }
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest user){

        if(userService.userNameExists(user.getUserName())){
            return ResponseEntity.status(400).body(new ApiMessage("User Name already taken. Try again"));
        }

        UserResponse ur = userService.createUser(user);
        if(ur != null){
            return ResponseEntity.status(201).body(ur);
        }

        return ResponseEntity.status(500).body(new ApiMessage("Error on user creation"));

    }


    @PatchMapping("/admin/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id,
                                        @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                        @Valid @RequestBody UpdateRoleRequest update){
        if(authService.isAdmin(authorizationHeader) && userService.updateIfValidRole(id, update) ){

            return ResponseEntity.status(200).body(new ApiMessage("Role Updated"));

        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @PatchMapping("/users/{id}/pin")
    public ResponseEntity<?> updatePin(@PathVariable Long id,
                                       @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                       @Valid @RequestBody UpdatePinRequest update){

        if( authService.isAccountOwner(authorizationHeader, id)
                && userService.updatePinIfAuthenticated(update, id) ){
            return ResponseEntity.status(200).body(new ApiMessage("Password Updated"));
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id,
                                            @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                            @Valid @RequestBody DeleteUserRequest loginRequest){

        if( authService.isAccountOwner(authorizationHeader, id) && userService.deleteUserIfAuthenticated(loginRequest, id) ){
            return ResponseEntity.status(200).body(new ApiMessage("User " + loginRequest.getUserName() + " Deleted"));
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


}