package com.library.lms.service;

import com.library.lms.dto.FineRecordDto;
import com.library.lms.entity.User;

import java.util.List;

public interface FineService {
    List<FineRecordDto> getMyFines(User currentUser);
    List<FineRecordDto> getStudentFines(Long studentId, User currentUser);
    List<FineRecordDto> getAllFines();
    FineRecordDto payFine(Long fineId, User currentUser);
}
