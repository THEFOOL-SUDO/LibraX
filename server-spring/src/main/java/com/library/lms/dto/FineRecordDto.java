package com.library.lms.dto;

import com.library.lms.entity.FineRecord;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FineRecordDto {
    private Long id;
    private Long studentId;
    private UserDto student;
    private Long borrowRecordId;
    private BorrowRecordDto borrowRecord;
    private BigDecimal amount;
    private String reason;
    private Boolean isPaid;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public FineRecordDto() {}

    public FineRecordDto(Long id, Long studentId, UserDto student, Long borrowRecordId, BorrowRecordDto borrowRecord, BigDecimal amount, String reason, Boolean isPaid, LocalDateTime paidAt, LocalDateTime createdAt) {
        this.id = id;
        this.studentId = studentId;
        this.student = student;
        this.borrowRecordId = borrowRecordId;
        this.borrowRecord = borrowRecord;
        this.amount = amount;
        this.reason = reason;
        this.isPaid = isPaid;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long studentId;
        private UserDto student;
        private Long borrowRecordId;
        private BorrowRecordDto borrowRecord;
        private BigDecimal amount;
        private String reason;
        private Boolean isPaid;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder studentId(Long studentId) { this.studentId = studentId; return this; }
        public Builder student(UserDto student) { this.student = student; return this; }
        public Builder borrowRecordId(Long borrowRecordId) { this.borrowRecordId = borrowRecordId; return this; }
        public Builder borrowRecord(BorrowRecordDto borrowRecord) { this.borrowRecord = borrowRecord; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder isPaid(Boolean isPaid) { this.isPaid = isPaid; return this; }
        public Builder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public FineRecordDto build() {
            return new FineRecordDto(id, studentId, student, borrowRecordId, borrowRecord, amount, reason, isPaid, paidAt, createdAt);
        }
    }

    public static FineRecordDto fromEntity(FineRecord record) {
        if (record == null) return null;
        return FineRecordDto.builder()
                .id(record.getId())
                .studentId(record.getStudent() != null ? record.getStudent().getId() : null)
                .student(record.getStudent() != null ? UserDto.fromEntity(record.getStudent()) : null)
                .borrowRecordId(record.getBorrowRecord() != null ? record.getBorrowRecord().getId() : null)
                .borrowRecord(record.getBorrowRecord() != null ? BorrowRecordDto.fromEntity(record.getBorrowRecord()) : null)
                .amount(record.getAmount())
                .reason(record.getReason())
                .isPaid(record.getIsPaid())
                .paidAt(record.getPaidAt())
                .createdAt(record.getCreatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }
    public Long getBorrowRecordId() { return borrowRecordId; }
    public void setBorrowRecordId(Long borrowRecordId) { this.borrowRecordId = borrowRecordId; }
    public BorrowRecordDto getBorrowRecord() { return borrowRecord; }
    public void setBorrowRecord(BorrowRecordDto borrowRecord) { this.borrowRecord = borrowRecord; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
