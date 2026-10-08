package com.library.lms.service;

import com.library.lms.dto.BookRequestDto;
import com.library.lms.dto.BookRequestInputDto;
import com.library.lms.entity.User;

import java.util.List;

public interface BookRequestService {
    BookRequestDto createRequest(BookRequestInputDto input, User currentUser);
    List<BookRequestDto> getMyRequests(User currentUser);
    List<BookRequestDto> getAllRequests();
    BookRequestDto updateStatus(Long id, String status);
}
