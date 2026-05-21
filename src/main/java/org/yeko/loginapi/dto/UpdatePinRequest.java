package org.yeko.loginapi.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdatePinRequest {
    @NotBlank(message = "User name is required")
    private String userName;
    @NotBlank(message = "User pin is required")
    private String userPin;
    @NotBlank(message = "User newPin is required")
    private String newUserPin;

    public UpdatePinRequest(){}
    public UpdatePinRequest(String userName, String userPin, String newUserPin){
        this.userName = userName;
        this.userPin = userPin;
        this.newUserPin = newUserPin;
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


    public String getNewUserPin() {
        return newUserPin;
    }
    public void setNewUserPin(String newUserPin) {
        this.newUserPin = newUserPin;
    }


}