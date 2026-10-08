package com.library.lms.controller;

import com.library.lms.dto.FineRecordDto;
import com.library.lms.entity.User;
import com.library.lms.service.FineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
@Tag(name = "Fines", description = "Endpoints for overdue fine assessment, viewing, and payment")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @GetMapping("/my-fines")
    @Operation(summary = "Get user's fines", description = "Retrieves overdue fines for the authenticated student")
    public ResponseEntity<List<FineRecordDto>> getMyFines(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(fineService.getMyFines(currentUser));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get student's fines", description = "Retrieves overdue fines for a specific student")
    public ResponseEntity<List<FineRecordDto>> getStudentFines(
            @PathVariable Long studentId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(fineService.getStudentFines(studentId, currentUser));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all fines", description = "Admin only: retrieves all fine records in the system")
    public ResponseEntity<List<FineRecordDto>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    @RequestMapping(value = {"/pay/{id}", "/{id}/pay"}, method = {RequestMethod.POST, RequestMethod.PUT})
    @Operation(summary = "Pay a fine", description = "Marks an overdue fine as settled and paid")
    public ResponseEntity<FineRecordDto> payFine(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(fineService.payFine(id, currentUser));
    }
}
