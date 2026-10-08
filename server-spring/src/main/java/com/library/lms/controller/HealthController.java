package com.library.lms.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "System health check and uptime status")
public class HealthController {

    private final long startTime = System.currentTimeMillis();

    @GetMapping("/")
    @Operation(summary = "Root status", description = "Verifies API server status")
    public ResponseEntity<Map<String, String>> root() {
        return ResponseEntity.ok(Map.of(
                "message", "Spring Boot Library Management System API is running",
                "swagger", "/swagger-ui.html",
                "health", "/api/health"
        ));
    }

    @GetMapping("/api/health")
    @Operation(summary = "Health check", description = "Provides system uptime and health state")
    public ResponseEntity<Map<String, Object>> health() {
        double uptimeSec = (System.currentTimeMillis() - startTime) / 1000.0;
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "framework", "Spring Boot 3",
                "uptime", uptimeSec,
                "timestamp", Instant.now().toString()
        ));
    }
}
