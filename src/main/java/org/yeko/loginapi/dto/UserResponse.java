package org.yeko.loginapi.dto;

public class UserResponse {
    private Long userId;
    private String userName;
    private String userRole;


    public UserResponse(){}
    public UserResponse(Long userId, String userName){
        this.userId = userId;
        this.userName = userName;
    }
    public UserResponse(Long userId, String userName, String userRole) {
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
    }

    @Override
    public String toString() {
        return "UserResponse{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", userRole='" + userRole + '\'' +
                '}';
    }




    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }


    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public String getUserRole() {
        return userRole;
    }
    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }


}
