package com.library.lms.controller;

import com.library.lms.dto.StudentDto;
import com.library.lms.dto.UserDto;
import com.library.lms.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Students", description = "Admin only: student directory, status management, and analytics")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @Operation(summary = "Get all students", description = "Admin only: retrieves list of students along with borrow and fine statistics")
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID", description = "Admin only: fetches details of a specific student")
    public ResponseEntity<UserDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Toggle student active status", description = "Admin only: enables or disables student access")
    public ResponseEntity<UserDto> toggleStudentStatus(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.toggleStudentStatus(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate student", description = "Admin only: deactivates student account")
    public ResponseEntity<UserDto> deactivateStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.toggleStudentStatus(id));
    }
}
