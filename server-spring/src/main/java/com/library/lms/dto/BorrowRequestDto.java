package com.library.lms.dto;

import jakarta.validation.constraints.NotNull;

public class BorrowRequestDto {
    private Long studentId;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private Integer days;

    public BorrowRequestDto() {}

    public BorrowRequestDto(Long studentId, Long bookId, Integer days) {
        this.studentId = studentId;
        this.bookId = bookId;
        this.days = days;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }
}
