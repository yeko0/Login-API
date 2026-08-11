package org.yeko.loginapi.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.yeko.loginapi.dto.LoginRequest;
import org.yeko.loginapi.dto.LoginResponse;
import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.service.AuthService;
import org.yeko.loginapi.service.UserService;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserService userService;


    @Test
    void loginReturnsOkWithValidCredentials() throws Exception {
        LoginResponse loginResponse =
                new LoginResponse("fake-token-123", 1L, "testName", "USER");

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(Optional.of(loginResponse));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userName": "testName",
                                  "userPin": "1234"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-token-123"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.userName").value("testName"))
                .andExpect(jsonPath("$.userRole").value("USER"));
    }


    @Test
    void loginReturnsUnauthorizedWithInvalidCredentials() throws Exception {

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userName": "testName",
                                  "userPin": "1234"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.backendMessage[0]").value("Access Denied"));
    }


    @Test
    void loginReturnsBadRequestWhenUserPinIsMissing() throws Exception {

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userName": "testName"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.backendMessage[0]").value("User pin is required"));
    }


    @Test
    void loginReturnsBadRequestWhenUserNameIsMissing() throws Exception {

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userPin": "testPin"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.backendMessage[0]").value("User name is required"));
    }


    @Test
    void authSessionWithValidToken() throws Exception {

        String fakeToken = "fake-token-123";
        String authorizationHeader = "Bearer "+ fakeToken;

        UserResponse fakeUser = new UserResponse(1L, "testName", "USER");

        when(authService.getValidToken(authorizationHeader))
                .thenReturn(Optional.of(fakeToken));

        when(authService.userInTokenExists(fakeToken))
                .thenReturn(true);

        when(userService.getUserByToken(authorizationHeader))
                .thenReturn(fakeUser);

        mockMvc.perform(get("/auth/session")
                        .header("Authorization", authorizationHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.userName").value("testName"))
                .andExpect(jsonPath("$.userRole").value("USER"));
    }


    @Test
    void authSessionWithInvalidToken() throws Exception {
        String authorizationHeader = "Bearer invalid-token-123";

        when(authService.getValidToken(authorizationHeader))
                .thenReturn(Optional.empty());

        mockMvc.perform(get("/auth/session")
                        .header("Authorization", authorizationHeader))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.backendMessage[0]").value("Access Denied"));
    }


    @Test
    void authSessionWithValidTokenButUserDeleted() throws Exception {
        String fakeToken = "fake-token-123";
        String authorizationHeader = "Bearer "+ fakeToken;

        when(authService.getValidToken(authorizationHeader))
                .thenReturn(Optional.of(fakeToken));

        when(authService.userInTokenExists(fakeToken))
                .thenReturn(false);

        mockMvc.perform(get("/auth/session")
                        .header("Authorization", authorizationHeader))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.backendMessage[0]").value("Access Denied"));

        verify(authService).getValidToken(authorizationHeader);
        verify(authService).userInTokenExists(fakeToken);
        verifyNoInteractions(userService);
    }


}
