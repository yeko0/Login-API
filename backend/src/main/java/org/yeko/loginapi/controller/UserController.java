package org.yeko.loginapi.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.exception.BadRequestException;
import org.yeko.loginapi.exception.DataConflictException;
import org.yeko.loginapi.exception.ResourceNotFoundException;
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
            return ResponseEntity.status(200).body(new ApiMessage(List.of("Users Empty")));
        }
        return ResponseEntity.ok(users);
    }


    @GetMapping("/admin/users")
    public ResponseEntity<?> adminGetAllUsers(@RequestHeader(value="Authorization", required=false)
                                                                  String authorizationHeader){

        if(authService.isAdmin(authorizationHeader) ) {

            List<UserResponse> users = userService.getAllUsers();
            if (users.isEmpty()) {
                return ResponseEntity.status(200).body(new ApiMessage(List.of("Users Empty")));
            }
            return ResponseEntity.ok(users);

        }else if (authService.isUser(authorizationHeader) ){
            return ResponseEntity.status(403).body(new ApiMessage(List.of("Access Denied")));
        }
        return ResponseEntity.status(401).body(new ApiMessage(List.of("Access Denied")));
    }


    @GetMapping("/users/{id}")
    public ResponseEntity<?> adminGetUserById(@PathVariable @Positive Long id,
                                              @RequestHeader(value="Authorization", required=false)
                                              String authorizationHeader){

        if( authService.isAdmin(authorizationHeader) ){

            UserResponse user = userService.findPublicUserById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            return ResponseEntity.ok(user);

        }else if (authService.isUser(authorizationHeader) ){
            return ResponseEntity.status(403).body(new ApiMessage(List.of("Access Denied")));
        }

        return ResponseEntity.status(401).body(new ApiMessage(List.of("Access Denied")));
    }


    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest user){

        if (userService.userNameExists(user.getUserName())) {
            throw new DataConflictException("User data conflict");
        }

        UserResponse ur = userService.createUser(user);

        return ResponseEntity.status(201).body(ur);
    }


    @PatchMapping("/admin/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable @Positive Long id,
                                            @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                            @Valid @RequestBody UpdateRoleRequest roleUpdate){
        if(authService.isAdmin(authorizationHeader) ){
            if(userService.updateIfValidRole(id, roleUpdate) ) {
                return ResponseEntity.status(200).body(new ApiMessage(List.of("Role Updated")));
            }
            throw new BadRequestException("Bad request");

        } else if (authService.isUser(authorizationHeader)) {
            return ResponseEntity.status(403).body(new ApiMessage(List.of("Access Denied")));
        }

        return ResponseEntity.status(401).body(new ApiMessage(List.of("Access Denied")));
    }


    @PatchMapping("/users/{id}/pin")
    public ResponseEntity<?> updatePin(@PathVariable @Positive Long id,
                                       @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                       @Valid @RequestBody UpdatePinRequest update){

        if( authService.isAccountOwner(authorizationHeader, id) ){

            if( userService.updatePinIfAuthenticated(update, id) ){
                return ResponseEntity.status(200).body(new ApiMessage(List.of("Password Updated")));
            }
            return ResponseEntity.status(403).body(new ApiMessage(List.of("Access Denied")));
        }

        return ResponseEntity.status(401).body(new ApiMessage(List.of("Access Denied")));
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable @Positive Long id,
                                            @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                            @Valid @RequestBody DeleteUserRequest loginRequest){

        if( authService.isAccountOwner(authorizationHeader, id) ){

            if(userService.deleteUserIfAuthenticated(loginRequest, id) ){
                return ResponseEntity.status(200).body(new ApiMessage(List.of("User Deleted")));
            }
            return ResponseEntity.status(403).body(new ApiMessage(List.of("Access Denied")));
        }

        return ResponseEntity.status(401).body(new ApiMessage(List.of("Access Denied")));
    }


}