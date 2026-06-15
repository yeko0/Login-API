package org.yeko.loginapi.dto;

import jakarta.validation.constraints.NotBlank;

public class DeleteUserRequest {
    @NotBlank(message = "User name is required")
    private String userName;
    @NotBlank(message = "User pin is required")
    private String userPin;

    public DeleteUserRequest(){}
    public DeleteUserRequest(String userName, String userPin) {
        this.userName = userName;
        this.userPin = userPin;
    }


    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }


    public String getUserPin() {
        return userPin;
    }
    public void setUserPin(String userPin) {
        this.userPin = userPin;
    }
}
