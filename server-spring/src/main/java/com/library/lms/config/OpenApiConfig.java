package com.library.lms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:5000}")
    private String serverPort;

    @Bean
    public OpenAPI libraryOpenAPI() {
        final String securitySchemeName = "BearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Library Management System API")
                        .description("Comprehensive REST API for University Library Management System built with Spring Boot 3, Spring Data JPA, and Spring Security.")
                        .version("1.0.0")
                        .contact(new Contact().name("Library Admin").email("admin@library.com"))
                        .license(new License().name("Apache 2.0").url("https://spring.io/")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort).description("Current Environment Server"),
                        new Server().url("http://localhost:5000").description("Port 5000 (React Frontend Proxy)")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token obtained from `/api/auth/login`")));
    }
}
