package com.library.lms.service.impl;

import com.library.lms.dto.BookRequestDto;
import com.library.lms.dto.BookRequestInputDto;
import com.library.lms.entity.BookRequest;
import com.library.lms.entity.RequestStatus;
import com.library.lms.entity.User;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.repository.BookRequestRepository;
import com.library.lms.service.BookRequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookRequestServiceImpl implements BookRequestService {

    private static final Logger log = LoggerFactory.getLogger(BookRequestServiceImpl.class);

    private final BookRequestRepository bookRequestRepository;

    public BookRequestServiceImpl(BookRequestRepository bookRequestRepository) {
        this.bookRequestRepository = bookRequestRepository;
    }

    @Override
    @Transactional
    public BookRequestDto createRequest(BookRequestInputDto input, User currentUser) {
        log.info("Creating book request for student ID {}: {}", currentUser.getId(), input.getTitle());

        BookRequest request = BookRequest.builder()
                .student(currentUser)
                .title(input.getTitle().trim())
                .author(input.getAuthor() != null ? input.getAuthor().trim() : null)
                .description(input.getDescription())
                .status(RequestStatus.PENDING)
                .build();

        request = bookRequestRepository.save(request);
        return BookRequestDto.fromEntity(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookRequestDto> getMyRequests(User currentUser) {
        return bookRequestRepository.findMyRequestsWithStudent(currentUser.getId()).stream()
                .map(BookRequestDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookRequestDto> getAllRequests() {
        return bookRequestRepository.findAllWithStudent().stream()
                .map(BookRequestDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public BookRequestDto updateStatus(Long id, String status) {
        BookRequest request = bookRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book request not found with ID: " + id));

        request.setStatus(RequestStatus.fromString(status));
        request = bookRequestRepository.save(request);
        log.info("Updated request ID {} status to {}", id, request.getStatus());

        return BookRequestDto.fromEntity(request);
    }
}
