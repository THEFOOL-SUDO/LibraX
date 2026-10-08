package com.library.lms.service;

import com.library.lms.dto.*;
import com.library.lms.entity.User;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
    UserDto getMe(User currentUser);
    void changePassword(User currentUser, ChangePasswordRequest request);
}
