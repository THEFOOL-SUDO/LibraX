package com.library.lms.service.impl;

import com.library.lms.dto.BorrowRecordDto;
import com.library.lms.dto.BorrowRequestDto;
import com.library.lms.dto.ReturnRequestDto;
import com.library.lms.entity.*;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.BorrowRecordRepository;
import com.library.lms.repository.FineRecordRepository;
import com.library.lms.repository.UserRepository;
import com.library.lms.service.BorrowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BorrowServiceImpl implements BorrowService {

    private static final Logger log = LoggerFactory.getLogger(BorrowServiceImpl.class);

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final FineRecordRepository fineRecordRepository;

    @Value("${app.fine.per-day:5.0}")
    private double finePerDay;

    public BorrowServiceImpl(BorrowRecordRepository borrowRecordRepository, BookRepository bookRepository, UserRepository userRepository, FineRecordRepository fineRecordRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.fineRecordRepository = fineRecordRepository;
    }

    @Override
    @Transactional
    public BorrowRecordDto borrowBook(BorrowRequestDto request, User currentUser) {
        Long targetStudentId = (currentUser.getRole() == Role.ADMIN && request.getStudentId() != null)
                ? request.getStudentId()
                : currentUser.getId();

        log.info("Borrow request initiated for student ID {} and book ID {}", targetStudentId, request.getBookId());

        User student = userRepository.findById(targetStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + targetStudentId));

        if (!Boolean.TRUE.equals(student.getIsActive())) {
            throw new BadRequestException("Student account is inactive");
        }

        long activeCount = borrowRecordRepository.countByStudentIdAndStatus(targetStudentId, BorrowStatus.BORROWED);
        if (activeCount >= 5) {
            throw new BadRequestException("Maximum borrow limit reached (5 books maximum)");
        }

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + request.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No available copies for book: " + book.getTitle());
        }

        boolean alreadyBorrowed = borrowRecordRepository
                .findFirstByStudentIdAndBookIdAndStatus(targetStudentId, book.getId(), BorrowStatus.BORROWED)
                .isPresent();

        if (alreadyBorrowed) {
            throw new BadRequestException("You have already borrowed this book and have not returned it yet");
        }

        int borrowDays = (request.getDays() != null && request.getDays() > 0) ? request.getDays() : 14;
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = now.plusDays(borrowDays);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = BorrowRecord.builder()
                .student(student)
                .book(book)
                .borrowDate(now)
                .dueDate(dueDate)
                .status(BorrowStatus.BORROWED)
                .issuedBy(currentUser.getRole() == Role.ADMIN ? currentUser : null)
                .build();

        record = borrowRecordRepository.save(record);
        log.info("Book borrowed successfully. Record ID: {}", record.getId());

        return BorrowRecordDto.fromEntity(record);
    }

    @Override
    @Transactional
    public BorrowRecordDto returnBook(ReturnRequestDto request, User currentUser) {
        log.info("Return request initiated for borrow record ID {}", request.getBorrowRecordId());

        BorrowRecord record = borrowRecordRepository.findById(request.getBorrowRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found with ID: " + request.getBorrowRecordId()));

        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("This book has already been returned");
        }

        if (currentUser.getRole() != Role.ADMIN && !record.getStudent().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to return this book");
        }

        LocalDateTime now = LocalDateTime.now();
        record.setReturnDate(now);
        record.setStatus(BorrowStatus.RETURNED);

        if (now.isAfter(record.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(record.getDueDate().toLocalDate(), now.toLocalDate());
            if (daysOverdue > 0) {
                BigDecimal fineAmount = BigDecimal.valueOf(daysOverdue * finePerDay);
                FineRecord fine = FineRecord.builder()
                        .student(record.getStudent())
                        .borrowRecord(record)
                        .amount(fineAmount)
                        .reason("Overdue by " + daysOverdue + " day(s)")
                        .isPaid(false)
                        .build();
                fineRecordRepository.save(fine);
                log.info("Fine recorded for student {}: ${}", record.getStudent().getEmail(), fineAmount);
            }
        }

        Book book = record.getBook();
        book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
        bookRepository.save(book);

        record = borrowRecordRepository.save(record);
        log.info("Book returned successfully. Record ID: {}", record.getId());

        return BorrowRecordDto.fromEntity(record);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowRecordDto> getMyBorrows(User currentUser) {
        return borrowRecordRepository.findMyBorrowsWithDetails(currentUser.getId()).stream()
                .map(BorrowRecordDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowRecordDto> getStudentBorrows(Long studentId, User currentUser) {
        Long targetId = (currentUser.getRole() == Role.ADMIN && studentId != null) ? studentId : currentUser.getId();
        return borrowRecordRepository.findMyBorrowsWithDetails(targetId).stream()
                .map(BorrowRecordDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowRecordDto> getOverdueBorrows() {
        return borrowRecordRepository.findActiveOverdueRecords(LocalDateTime.now()).stream()
                .map(BorrowRecordDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public com.library.lms.dto.BorrowPageResponse getAllBorrows(String status, int page, int limit) {
        int pageIndex = Math.max(0, page - 1);
        int pageSize = Math.max(1, limit);
        Pageable pageable = PageRequest.of(pageIndex, pageSize, Sort.by(Sort.Direction.DESC, "borrowDate"));

        Page<BorrowRecord> pageResult;
        if (status != null && !status.isBlank() && !"all".equalsIgnoreCase(status.trim())) {
            BorrowStatus borrowStatus = BorrowStatus.fromString(status);
            pageResult = borrowRecordRepository.findByStatus(borrowStatus, pageable);
        } else {
            pageResult = borrowRecordRepository.findAllWithDetails(pageable);
        }

        List<BorrowRecordDto> records = pageResult.getContent().stream()
                .map(BorrowRecordDto::fromEntity)
                .toList();

        return com.library.lms.dto.BorrowPageResponse.builder()
                .borrows(records)
                .total(pageResult.getTotalElements())
                .page(page)
                .totalPages(pageResult.getTotalPages())
                .build();
    }
}
