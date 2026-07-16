package org.yeko.loginapi.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yeko.loginapi.dto.ApiMessage;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.service.AuthService;
import org.yeko.loginapi.service.UserService;

import java.util.List;
import java.util.Optional;


@RestController
public class AuthController {
    private final AuthService authService;
    private final UserService userService;


    public AuthController(AuthService authService, UserService userService){
        this.authService = authService;
        this.userService = userService;
    }


    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest){

        Optional<LoginResponse> response = authService.login(loginRequest);

        if (response.isEmpty()){
            return ResponseEntity.status(401).body(new ApiMessage(List.of("Access Denied")));
        }

        return ResponseEntity.ok(response.get());
    }


    @GetMapping("/auth/session")
    public ResponseEntity<UserResponse> getValidSession(@RequestHeader(value="Authorization", required = false)
                                             String authorizationHeader){

        UserResponse user = userService.getUserByToken(authorizationHeader);

        return ResponseEntity.ok(user);
    }



}
