package org.yeko.loginapi.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateRoleRequest {
    @NotBlank
    private String userRole;

    public UpdateRoleRequest(){}
    public UpdateRoleRequest(String userRole){
        this.userRole = userRole;
    }

    public String getUserRole(){
        return userRole;
    }
    public void setUserRole(String userRole){
        this.userRole = userRole;
    }
}
