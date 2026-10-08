package com.library.lms.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private UserDto user;

        public Builder token(String token) { this.token = token; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, user);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
