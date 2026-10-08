package com.library.lms.dto;

import java.time.LocalDateTime;

public class StudentDto {
    private Long id;
    private String name;
    private String studentId;
    private String email;
    private String phone;
    private LocalDateTime memberSince;
    private Boolean isActive;
    private long borrowCount;
    private long unpaidFinesCount;

    public StudentDto() {}

    public StudentDto(Long id, String name, String studentId, String email, String phone, LocalDateTime memberSince, Boolean isActive, long borrowCount, long unpaidFinesCount) {
        this.id = id;
        this.name = name;
        this.studentId = studentId;
        this.email = email;
        this.phone = phone;
        this.memberSince = memberSince;
        this.isActive = isActive;
        this.borrowCount = borrowCount;
        this.unpaidFinesCount = unpaidFinesCount;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String studentId;
        private String email;
        private String phone;
        private LocalDateTime memberSince;
        private Boolean isActive;
        private long borrowCount;
        private long unpaidFinesCount;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder studentId(String studentId) { this.studentId = studentId; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder memberSince(LocalDateTime memberSince) { this.memberSince = memberSince; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }
        public Builder borrowCount(long borrowCount) { this.borrowCount = borrowCount; return this; }
        public Builder unpaidFinesCount(long unpaidFinesCount) { this.unpaidFinesCount = unpaidFinesCount; return this; }

        public StudentDto build() {
            return new StudentDto(id, name, studentId, email, phone, memberSince, isActive, borrowCount, unpaidFinesCount);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public LocalDateTime getMemberSince() { return memberSince; }
    public void setMemberSince(LocalDateTime memberSince) { this.memberSince = memberSince; }
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }
    public long getBorrowCount() { return borrowCount; }
    public void setBorrowCount(long borrowCount) { this.borrowCount = borrowCount; }
    public long getUnpaidFinesCount() { return unpaidFinesCount; }
    public void setUnpaidFinesCount(long unpaidFinesCount) { this.unpaidFinesCount = unpaidFinesCount; }
}
