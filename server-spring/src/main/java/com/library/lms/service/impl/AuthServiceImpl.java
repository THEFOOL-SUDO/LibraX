package com.library.lms.service.impl;

import com.library.lms.config.JwtTokenProvider;
import com.library.lms.dto.*;
import com.library.lms.entity.Role;
import com.library.lms.entity.User;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.repository.UserRepository;
import com.library.lms.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.info("Attempting login for email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new BadRequestException("Account has been deactivated. Please contact the administrator.");
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            Role requestedRole = Role.fromString(request.getRole());
            if (user.getRole() != requestedRole) {
                throw new BadRequestException(
                        "This account is registered as " + user.getRole().name().toLowerCase() +
                        ". Please select " + user.getRole().name().toLowerCase() + " login."
                );
            }
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        String token = tokenProvider.generateToken(user);
        log.info("User logged in successfully: {} (Role: {})", email, user.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        log.info("Registering new user with email: {}", email);

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User already exists with this email");
        }

        Role role = Role.fromString(request.getRole());
        String studentId = (role == Role.STUDENT) ? request.getStudentId() : null;

        if (role == Role.STUDENT && (studentId == null || studentId.isBlank())) {
            throw new BadRequestException("Student ID is required for student registration");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .studentId(studentId != null ? studentId.trim() : null)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user);
        log.info("New user registered successfully: ID {}", user.getId());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getMe(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserDto.fromEntity(user);
    }

    @Override
    @Transactional
    public void changePassword(User currentUser, ChangePasswordRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password updated successfully for user ID {}", user.getId());
    }
}
