package com.library.lms.service;

import com.library.lms.dto.BorrowPageResponse;
import com.library.lms.dto.BorrowRecordDto;
import com.library.lms.dto.BorrowRequestDto;
import com.library.lms.dto.ReturnRequestDto;
import com.library.lms.entity.User;

import java.util.List;

public interface BorrowService {
    BorrowRecordDto borrowBook(BorrowRequestDto request, User currentUser);
    BorrowRecordDto returnBook(ReturnRequestDto request, User currentUser);
    List<BorrowRecordDto> getMyBorrows(User currentUser);
    List<BorrowRecordDto> getStudentBorrows(Long studentId, User currentUser);
    List<BorrowRecordDto> getOverdueBorrows();
    BorrowPageResponse getAllBorrows(String status, int page, int limit);
}
