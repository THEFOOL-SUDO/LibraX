package com.library.lms.controller;

import com.library.lms.dto.BorrowPageResponse;
import com.library.lms.dto.BorrowRecordDto;
import com.library.lms.dto.BorrowRequestDto;
import com.library.lms.dto.ReturnRequestDto;
import com.library.lms.entity.User;
import com.library.lms.service.BorrowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@Tag(name = "Borrow Operations", description = "Endpoints for book borrowing, returning, and tracking")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    @PostMapping({"", "/issue"})
    @Operation(summary = "Borrow or issue a book", description = "Lends a book to the student, decrementing available copies")
    public ResponseEntity<BorrowRecordDto> borrowBook(
            @Valid @RequestBody BorrowRequestDto request,
            @AuthenticationPrincipal User currentUser) {
        BorrowRecordDto record = borrowService.borrowBook(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(record);
    }

    @PostMapping("/return")
    @Operation(summary = "Return a book", description = "Returns a borrowed book, increments available copies, and assesses overdue fine if late")
    public ResponseEntity<BorrowRecordDto> returnBook(
            @Valid @RequestBody ReturnRequestDto request,
            @AuthenticationPrincipal User currentUser) {
        BorrowRecordDto record = borrowService.returnBook(request, currentUser);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/my-borrows")
    @Operation(summary = "Get user's borrow history", description = "Returns list of borrow records for the authenticated student")
    public ResponseEntity<List<BorrowRecordDto>> getMyBorrows(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(borrowService.getMyBorrows(currentUser));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student's borrow history", description = "Returns list of borrow records for a specific student")
    public ResponseEntity<List<BorrowRecordDto>> getStudentBorrows(
            @PathVariable Long studentId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(borrowService.getStudentBorrows(studentId, currentUser));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue borrows", description = "Returns all unreturned borrows that have passed their due date")
    public ResponseEntity<List<BorrowRecordDto>> getOverdueBorrows() {
        return ResponseEntity.ok(borrowService.getOverdueBorrows());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all borrow records", description = "Admin only: paginated list of all library borrows")
    public ResponseEntity<BorrowPageResponse> getAllBorrows(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(borrowService.getAllBorrows(status, page, limit));
    }
}
