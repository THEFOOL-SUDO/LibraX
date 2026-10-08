package com.library.lms.service.impl;

import com.library.lms.dto.StudentDto;
import com.library.lms.dto.UserDto;
import com.library.lms.entity.BorrowStatus;
import com.library.lms.entity.Role;
import com.library.lms.entity.User;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.repository.BorrowRecordRepository;
import com.library.lms.repository.FineRecordRepository;
import com.library.lms.repository.UserRepository;
import com.library.lms.service.StudentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private static final Logger log = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FineRecordRepository fineRecordRepository;

    public StudentServiceImpl(UserRepository userRepository, BorrowRecordRepository borrowRecordRepository, FineRecordRepository fineRecordRepository) {
        this.userRepository = userRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.fineRecordRepository = fineRecordRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        List<User> students = userRepository.findActiveUsersByRole(Role.STUDENT, true);

        return students.stream().map(student -> {
            long borrowCount = borrowRecordRepository.countByStudentIdAndStatus(student.getId(), BorrowStatus.BORROWED);
            long unpaidFines = fineRecordRepository.findByStudentIdOrderByCreatedAtDesc(student.getId())
                    .stream().filter(f -> !Boolean.TRUE.equals(f.getIsPaid())).count();

            return StudentDto.builder()
                    .id(student.getId())
                    .name(student.getName())
                    .studentId(student.getStudentId())
                    .email(student.getEmail())
                    .phone(student.getPhone())
                    .memberSince(student.getMemberSince())
                    .isActive(student.getIsActive())
                    .borrowCount(borrowCount)
                    .unpaidFinesCount(unpaidFines)
                    .build();
        }).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getStudentById(Long id) {
        User student = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return UserDto.fromEntity(student);
    }

    @Override
    @Transactional
    public UserDto toggleStudentStatus(Long id) {
        User student = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        student.setIsActive(!Boolean.TRUE.equals(student.getIsActive()));
        student = userRepository.save(student);
        log.info("Toggled active status for student ID {}: active={}", id, student.getIsActive());

        return UserDto.fromEntity(student);
    }
}
