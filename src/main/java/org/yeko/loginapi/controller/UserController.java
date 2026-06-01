package org.yeko.loginapi.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yeko.loginapi.dto.*;
import org.yeko.loginapi.service.AuthService;
import org.yeko.loginapi.service.UserService;

import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<?> adminGetAllUsers(@RequestHeader(value="Authorization", required=false)
                                                                  String authorizationHeader){

        if(authService.isAdmin(authorizationHeader) ) {

            List<UserResponse> users = userService.getAllUsers();
            if (users.isEmpty()) {
                return ResponseEntity.status(200).body(new ApiMessage("Users Empty"));
            }
            return ResponseEntity.ok(users);

        }else if (authService.isUser(authorizationHeader) ){
            return ResponseEntity.status(403).body(new ApiMessage("Access Denied"));
        }
        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @GetMapping("/users/{id}")
    public ResponseEntity<?> adminGetUserById(@PathVariable Long id,
                                              @RequestHeader(value="Authorization", required=false)
                                                                    String authorizationHeader){

        if( authService.isAdmin(authorizationHeader) ){

            Optional<UserResponse> ur = userService.findPublicUserById(id);

            if (ur.isPresent()) {
                return ResponseEntity.ok(ur.get());
            }
            return ResponseEntity.status(404).body(new ApiMessage("Not Found"));

        }else if (authService.isUser(authorizationHeader) ){
            return ResponseEntity.status(403).body(new ApiMessage("Access Denied"));
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest user){

        if(userService.userNameExists(user.getUserName())){
            return ResponseEntity.status(409).body(new ApiMessage("User data conflict. Try again"));
        }

        Optional<UserResponse> ur = userService.createUser(user);
        if(ur.isPresent()){
            return ResponseEntity.status(201).body(ur.get());
        }

        return ResponseEntity.status(500).body(new ApiMessage("Error on user creation"));
    }


    @PatchMapping("/admin/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id,
                                        @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                        @Valid @RequestBody UpdateRoleRequest update){
        if(authService.isAdmin(authorizationHeader) ){
            if(userService.updateIfValidRole(id, update) ) {

                return ResponseEntity.status(200).body(new ApiMessage("Role Updated"));
            }
            return ResponseEntity.status(400).body(new ApiMessage("Invalid request"));

        } else if (authService.isUser(authorizationHeader)) {
            return ResponseEntity.status(403).body(new ApiMessage("Access Denied"));
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @PatchMapping("/users/{id}/pin")
    public ResponseEntity<?> updatePin(@PathVariable Long id,
                                       @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                       @Valid @RequestBody UpdatePinRequest update){

        if( authService.isAccountOwner(authorizationHeader, id) ){

            if( userService.updatePinIfAuthenticated(update, id) ){
                return ResponseEntity.status(200).body(new ApiMessage("Password Updated"));
            }
            return ResponseEntity.status(403).body(new ApiMessage("Access Denied"));
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id,
                                            @RequestHeader(value="Authorization", required=false) String authorizationHeader,
                                            @Valid @RequestBody DeleteUserRequest loginRequest){

        if( authService.isAccountOwner(authorizationHeader, id) ){

            if(userService.deleteUserIfAuthenticated(loginRequest, id) ){
                return ResponseEntity.status(200).body(new ApiMessage("User Deleted"));
            }
            return ResponseEntity.status(403).body(new ApiMessage("Access Denied"));
        }

        return ResponseEntity.status(401).body(new ApiMessage("Access Denied"));
    }


}