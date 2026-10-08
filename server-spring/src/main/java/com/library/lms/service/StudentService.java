package com.library.lms.service;

import com.library.lms.dto.StudentDto;
import com.library.lms.dto.UserDto;

import java.util.List;

public interface StudentService {
    List<StudentDto> getAllStudents();
    UserDto getStudentById(Long id);
    UserDto toggleStudentStatus(Long id);
}
