package com.library.lms.entity;

public enum Role {
    ADMIN,
    STUDENT;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return STUDENT;
        for (Role role : Role.values()) {
            if (role.name().equalsIgnoreCase(roleStr.trim())) {
                return role;
            }
        }
        return STUDENT;
    }
}
