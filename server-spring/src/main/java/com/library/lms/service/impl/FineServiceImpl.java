package com.library.lms.service.impl;

import com.library.lms.dto.FineRecordDto;
import com.library.lms.entity.FineRecord;
import com.library.lms.entity.Role;
import com.library.lms.entity.User;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.repository.FineRecordRepository;
import com.library.lms.service.FineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FineServiceImpl implements FineService {

    private static final Logger log = LoggerFactory.getLogger(FineServiceImpl.class);

    private final FineRecordRepository fineRecordRepository;

    public FineServiceImpl(FineRecordRepository fineRecordRepository) {
        this.fineRecordRepository = fineRecordRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineRecordDto> getMyFines(User currentUser) {
        return fineRecordRepository.findMyFinesWithDetails(currentUser.getId()).stream()
                .map(FineRecordDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineRecordDto> getStudentFines(Long studentId, User currentUser) {
        Long targetId = (currentUser.getRole() == Role.ADMIN && studentId != null) ? studentId : currentUser.getId();
        return fineRecordRepository.findMyFinesWithDetails(targetId).stream()
                .map(FineRecordDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FineRecordDto> getAllFines() {
        return fineRecordRepository.findAllWithDetails().stream()
                .map(FineRecordDto::fromEntity)
                .toList();
    }

    @Override
    @Transactional
    public FineRecordDto payFine(Long fineId, User currentUser) {
        log.info("Processing fine payment for fine ID: {}", fineId);

        FineRecord fine = fineRecordRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine record not found with ID: " + fineId));

        if (Boolean.TRUE.equals(fine.getIsPaid())) {
            throw new BadRequestException("Fine is already marked as paid");
        }

        if (currentUser.getRole() != Role.ADMIN && !fine.getStudent().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to pay this fine");
        }

        fine.setIsPaid(true);
        fine.setPaidAt(LocalDateTime.now());
        fine = fineRecordRepository.save(fine);

        log.info("Fine ID {} successfully marked as paid", fineId);
        return FineRecordDto.fromEntity(fine);
    }
}
