package org.yeko.loginapi.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.exception.UnauthorizedException;
import org.yeko.loginapi.service.AuthService;
import org.yeko.loginapi.service.UserService;


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

        LoginResponse response = authService.login(loginRequest)
                .orElseThrow(() -> new UnauthorizedException("Access Denied"));

        return ResponseEntity.ok(response);
    }


    @GetMapping("/auth/session")
    public ResponseEntity<UserResponse> getValidSession(@RequestHeader(value="Authorization", required = false)
                                             String authorizationHeader){

        UserResponse user = userService.getUserByToken(authorizationHeader);

        return ResponseEntity.ok(user);
    }



}
