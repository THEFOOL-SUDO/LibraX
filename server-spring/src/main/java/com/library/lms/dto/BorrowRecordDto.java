package com.library.lms.dto;

import com.library.lms.entity.BorrowRecord;

import java.time.LocalDateTime;

public class BorrowRecordDto {
    private Long id;
    private Long studentId;
    private UserDto student;
    private Long bookId;
    private BookDto book;
    private LocalDateTime borrowDate;
    private LocalDateTime dueDate;
    private LocalDateTime returnDate;
    private String status;
    private Long issuedBy;

    public BorrowRecordDto() {}

    public BorrowRecordDto(Long id, Long studentId, UserDto student, Long bookId, BookDto book, LocalDateTime borrowDate, LocalDateTime dueDate, LocalDateTime returnDate, String status, Long issuedBy) {
        this.id = id;
        this.studentId = studentId;
        this.student = student;
        this.bookId = bookId;
        this.book = book;
        this.borrowDate = borrowDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
        this.issuedBy = issuedBy;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long studentId;
        private UserDto student;
        private Long bookId;
        private BookDto book;
        private LocalDateTime borrowDate;
        private LocalDateTime dueDate;
        private LocalDateTime returnDate;
        private String status;
        private Long issuedBy;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
        public Builder student(UserDto student) { this.student = student; return this; }
        public Builder bookId(Long bookId) { this.bookId = bookId; return this; }
        public Builder book(BookDto book) { this.book = book; return this; }
        public Builder borrowDate(LocalDateTime borrowDate) { this.borrowDate = borrowDate; return this; }
        public Builder dueDate(LocalDateTime dueDate) { this.dueDate = dueDate; return this; }
        public Builder returnDate(LocalDateTime returnDate) { this.returnDate = returnDate; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder issuedBy(Long issuedBy) { this.issuedBy = issuedBy; return this; }

        public BorrowRecordDto build() {
            return new BorrowRecordDto(id, studentId, student, bookId, book, borrowDate, dueDate, returnDate, status, issuedBy);
        }
    }

    public static BorrowRecordDto fromEntity(BorrowRecord record) {
        if (record == null) return null;
        return BorrowRecordDto.builder()
                .id(record.getId())
                .studentId(record.getStudent() != null ? record.getStudent().getId() : null)
                .student(record.getStudent() != null ? UserDto.fromEntity(record.getStudent()) : null)
                .bookId(record.getBook() != null ? record.getBook().getId() : null)
                .book(record.getBook() != null ? BookDto.fromEntity(record.getBook()) : null)
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .status(record.getStatus() == com.library.lms.entity.BorrowStatus.BORROWED ? "active" : 
                        (record.getStatus() != null ? record.getStatus().name().toLowerCase() : null))
                .issuedBy(record.getIssuedBy() != null ? record.getIssuedBy().getId() : null)
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }
    public BookDto getBook() { return book; }
    public void setBook(BookDto book) { this.book = book; }
    public LocalDateTime getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDateTime borrowDate) { this.borrowDate = borrowDate; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public LocalDateTime getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDateTime returnDate) { this.returnDate = returnDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getIssuedBy() { return issuedBy; }
    public void setIssuedBy(Long issuedBy) { this.issuedBy = issuedBy; }
}
