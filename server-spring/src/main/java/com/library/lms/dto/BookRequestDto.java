package com.library.lms.dto;

import com.library.lms.entity.BookRequest;

import java.time.LocalDateTime;

public class BookRequestDto {
    private Long id;
    private Long studentId;
    private UserDto student;
    private String title;
    private String author;
    private String description;
    private String status;
    private LocalDateTime createdAt;

    public BookRequestDto() {}

    public BookRequestDto(Long id, Long studentId, UserDto student, String title, String author, String description, String status, LocalDateTime createdAt) {
        this.id = id;
        this.studentId = studentId;
        this.student = student;
        this.title = title;
        this.author = author;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long studentId;
        private UserDto student;
        private String title;
        private String author;
        private String description;
        private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
        public Builder student(UserDto student) { this.student = student; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder author(String author) { this.author = author; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public BookRequestDto build() {
            return new BookRequestDto(id, studentId, student, title, author, description, status, createdAt);
        }
    }

    public static BookRequestDto fromEntity(BookRequest request) {
        if (request == null) return null;
        return BookRequestDto.builder()
                .id(request.getId())
                .studentId(request.getStudent() != null ? request.getStudent().getId() : null)
                .student(request.getStudent() != null ? UserDto.fromEntity(request.getStudent()) : null)
                .title(request.getTitle())
                .author(request.getAuthor())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus().name().toLowerCase() : null)
                .createdAt(request.getCreatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
