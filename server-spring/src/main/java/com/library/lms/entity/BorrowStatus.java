package com.library.lms.entity;

public enum BorrowStatus {
    BORROWED,
    RETURNED,
    OVERDUE;

    public static BorrowStatus fromString(String statusStr) {
        if (statusStr == null || statusStr.isBlank()) return BORROWED;
        String clean = statusStr.trim();
        if ("active".equalsIgnoreCase(clean) || "borrowed".equalsIgnoreCase(clean)) {
            return BORROWED;
        }
        for (BorrowStatus status : BorrowStatus.values()) {
            if (status.name().equalsIgnoreCase(clean)) {
                return status;
            }
        }
        return BORROWED;
    }
}
