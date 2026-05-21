package org.yeko.loginapi.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String userName;
    private String userRole;

    public LoginResponse(){}
    public LoginResponse(String token, Long userId, String userName, String userRole) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }


    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }


    public String getUserRole() {
        return userRole;
    }
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
}
