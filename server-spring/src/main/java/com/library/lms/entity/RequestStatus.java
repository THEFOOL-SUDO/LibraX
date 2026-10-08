package com.library.lms.entity;

public enum RequestStatus {
    PENDING,
    APPROVED,
    REJECTED;

    public static RequestStatus fromString(String statusStr) {
        if (statusStr == null) return PENDING;
        for (RequestStatus status : RequestStatus.values()) {
            if (status.name().equalsIgnoreCase(statusStr.trim())) {
                return status;
            }
        }
        return PENDING;
    }
}
