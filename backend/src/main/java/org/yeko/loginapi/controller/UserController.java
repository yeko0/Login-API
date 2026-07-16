package org.yeko.loginapi.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.exception.BadRequestException;
import org.yeko.loginapi.exception.DataConflictException;
import org.yeko.loginapi.exception.ForbiddenException;
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
    public ResponseEntity<?> adminGetAllUsers(){

        List<UserResponse> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.ok(new ApiMessage(List.of("Users Empty")));
        }

        return ResponseEntity.ok(users);
    }


    @GetMapping("/admin/users/{id}")
    public ResponseEntity<?> adminGetUserById(@PathVariable @Positive Long id){

        UserResponse user = userService.findPublicUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(user);
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
                                            @Valid @RequestBody UpdateRoleRequest roleUpdate){

            if(userService.updateIfValidRole(id, roleUpdate) ) {
                return ResponseEntity.ok(new ApiMessage(List.of("Role Updated")));
            }
            throw new BadRequestException("Invalid role or protected last admin");
    }


    @PatchMapping("/users/{id}/pin")
    public ResponseEntity<?> updatePin(@PathVariable @Positive Long id,
                                       @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                       @Valid @RequestBody UpdatePinRequest update){

        if( authService.isAccountOwner(authorizationHeader, id) ){
            userService.updatePinWithValidCredentials(update, id);
            return ResponseEntity.ok(new ApiMessage(List.of("Pin Updated")));
        }

        throw new ForbiddenException("Access Denied");
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable @Positive Long id,
                                            @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                            @Valid @RequestBody DeleteUserRequest loginRequest){

        if( authService.isAccountOwner(authorizationHeader, id) ){

            userService.deleteUserWithValidCredentials(loginRequest, id);
            return ResponseEntity.ok(new ApiMessage(List.of("User Deleted")));
        }
        throw new ForbiddenException("Access Denied");
    }


}