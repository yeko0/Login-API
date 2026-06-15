package org.yeko.loginapi.entity;

public class User {
    private Long userId;
    private String userName;
    private String userPin;
    private String userRole;

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                '}';
    }


    public User(){}
    public User(Long userId, String userName){
        this.userId = userId;
        this.userName = userName;
    }
    public User(String userName, String userPin) {
        this.userName = userName;
        this.userPin = userPin;
    }
    public User(Long userId, String userName, String userPin){
        this.userId = userId;
        this.userName = userName;
        this.userPin = userPin;
    }
    public User(Long userId, String userName, String userPin, String userRole) {
        this.userId = userId;
        this.userName = userName;
        this.userPin = userPin;
        this.userRole = userRole;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId){
        this.userId = userId;
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


    public String getUserRole() {
        return userRole;
    }
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }


}
