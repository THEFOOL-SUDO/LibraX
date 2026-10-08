package com.library.lms.controller;

import com.library.lms.dto.BookRequestDto;
import com.library.lms.dto.BookRequestInputDto;
import com.library.lms.entity.User;
import com.library.lms.service.BookRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@Tag(name = "Book Requests", description = "Endpoints for students requesting new book titles and admin approval")
public class RequestController {

    private final BookRequestService bookRequestService;

    public RequestController(BookRequestService bookRequestService) {
        this.bookRequestService = bookRequestService;
    }

    @PostMapping
    @Operation(summary = "Submit book request", description = "Student submits a proposal for a new library title")
    public ResponseEntity<BookRequestDto> submitRequest(
            @Valid @RequestBody BookRequestInputDto input,
            @AuthenticationPrincipal User currentUser) {
        BookRequestDto created = bookRequestService.createRequest(input, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping({"/my", "/my-requests"})
    @Operation(summary = "Get user's book requests", description = "Returns student's submitted requests")
    public ResponseEntity<List<BookRequestDto>> getMyRequests(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(bookRequestService.getMyRequests(currentUser));
    }

    @GetMapping({"", "/all"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all book requests", description = "Admin only: lists all student book requests")
    public ResponseEntity<List<BookRequestDto>> getAllRequests() {
        return ResponseEntity.ok(bookRequestService.getAllRequests());
    }

    @PutMapping({"/{id}", "/{id}/status"})
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update book request status", description = "Admin only: approves or rejects request")
    public ResponseEntity<BookRequestDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "pending");
        return ResponseEntity.ok(bookRequestService.updateStatus(id, status));
    }
}
