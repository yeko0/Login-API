package org.yeko.loginapi.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.yeko.loginapi.exception.ForbiddenException;
import org.yeko.loginapi.service.AuthService;

@Component
public class AdminInterceptor implements HandlerInterceptor {
    private final AuthService authService;

    public AdminInterceptor(AuthService authService){
        this.authService = authService;
    }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,
                             @NonNull HttpServletResponse response,
                             @NonNull Object handler) throws Exception {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())){
            return true;
        }

        String authorizationHeader = request.getHeader("Authorization");

        if (!authService.isAdmin(authorizationHeader)){
            throw new ForbiddenException("Access Denied");
        }

        return true;
    }
}
