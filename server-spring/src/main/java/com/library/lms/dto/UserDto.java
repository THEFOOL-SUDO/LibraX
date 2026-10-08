package com.library.lms.dto;

import com.library.lms.entity.User;

import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String studentId;
    private String phone;
    private Boolean isActive;
    private LocalDateTime memberSince;

    public UserDto() {}

    public UserDto(Long id, String name, String email, String role, String studentId, String phone, Boolean isActive, LocalDateTime memberSince) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.studentId = studentId;
        this.phone = phone;
        this.isActive = isActive;
        this.memberSince = memberSince;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private String role;
        private String studentId;
        private String phone;
        private Boolean isActive;
        private LocalDateTime memberSince;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public Builder memberSince(LocalDateTime memberSince) { this.memberSince = memberSince; return this; }

        public UserDto build() {
            return new UserDto(id, name, email, role, studentId, phone, isActive, memberSince);
        }
    }

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name().toLowerCase() : null)
                .studentId(user.getStudentId())
                .phone(user.getPhone())
                .isActive(user.getIsActive())
                .memberSince(user.getMemberSince())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public LocalDateTime getMemberSince() { return memberSince; }
    public void setMemberSince(LocalDateTime memberSince) { this.memberSince = memberSince; }
}
