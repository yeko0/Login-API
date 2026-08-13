package org.yeko.loginapi.controller;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import org.yeko.loginapi.dto.UserResponse;
import org.yeko.loginapi.service.AuthService;
import org.yeko.loginapi.service.UserService;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private AuthService authService;


    @Test
    void getUsersReturnsOkAndJsonList() throws Exception {
        List<UserResponse> users = List.of(new UserResponse(1L, "testName", "USER"));

        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].userName").value("testName"))
                .andExpect(jsonPath("$[0].userRole").value("USER"));

        verify(userService).getAllUsers();
        verifyNoInteractions(authService);
    }


    @Test
    void getUsersReturnsOkAndMessageWhenNoUsers() throws Exception {
        List<UserResponse> users = List.of();

        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isMap())
                .andExpect(jsonPath("$.backendMessage").isArray())
                .andExpect(jsonPath("$.backendMessage[0]").value("Users Empty"));

        verify(userService).getAllUsers();
        verifyNoInteractions(authService);
    }


    @Test
    void getAdminUsersReturnsOkAndJsonListWithValidAdminToken() throws Exception {

        String fakeToken = "fake-token-123";
        String authorizationHeader = "Bearer "+ fakeToken;
        List<UserResponse> users = List.of(new UserResponse(1L, "testName", "ADMIN"));

        when(authService.getValidToken(authorizationHeader)).thenReturn(Optional.of(fakeToken));

        when(authService.userInTokenExists(fakeToken)).thenReturn(true);

        when(authService.isAdmin(authorizationHeader)).thenReturn(true);

        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/admin/users")
                        .header("Authorization", authorizationHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].userName").value("testName"))
                .andExpect(jsonPath("$[0].userRole").value("ADMIN"));

        verify(authService).getValidToken(authorizationHeader);
        verify(authService).userInTokenExists(fakeToken);
        verify(authService).isAdmin(authorizationHeader);
        verify(userService).getAllUsers();
    }


}
