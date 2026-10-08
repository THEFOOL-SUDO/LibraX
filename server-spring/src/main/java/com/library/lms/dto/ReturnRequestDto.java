package com.library.lms.dto;

import jakarta.validation.constraints.NotNull;

public class ReturnRequestDto {
    @NotNull(message = "Borrow Record ID is required")
    private Long borrowRecordId;

    public ReturnRequestDto() {}

    public ReturnRequestDto(Long borrowRecordId) {
        this.borrowRecordId = borrowRecordId;
    }

    public Long getBorrowRecordId() { return borrowRecordId; }
    public void setBorrowRecordId(Long borrowRecordId) { this.borrowRecordId = borrowRecordId; }
}
