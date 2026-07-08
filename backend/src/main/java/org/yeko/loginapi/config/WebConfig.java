package org.yeko.loginapi.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.yeko.loginapi.interceptor.AuthInterceptor;
import org.yeko.loginapi.interceptor.LogInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final LogInterceptor logInterceptor;
    private final AuthInterceptor authInterceptor;

    public WebConfig(LogInterceptor logInterceptor, AuthInterceptor authInterceptor) {

        this.logInterceptor = logInterceptor;
        this.authInterceptor = authInterceptor;
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(logInterceptor)
                .addPathPatterns("/**");

        registry.addInterceptor(authInterceptor)
                .addPathPatterns(
                        "/admin/**",
                        "/users/*/pin",
                        "/users/*",
                        "/auth/session"
                );
    }


    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
