package com.library.lms.repository;

import com.library.lms.entity.BorrowRecord;
import com.library.lms.entity.BorrowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    // Derived Queries
    List<BorrowRecord> findByStudentIdOrderByBorrowDateDesc(Long studentId);

    Page<BorrowRecord> findByStudentId(Long studentId, Pageable pageable);

    List<BorrowRecord> findByBookId(Long bookId);

    Page<BorrowRecord> findByStatus(BorrowStatus status, Pageable pageable);

    long countByStudentIdAndStatus(Long studentId, BorrowStatus status);

    Optional<BorrowRecord> findFirstByStudentIdAndBookIdAndStatus(Long studentId, Long bookId, BorrowStatus status);

    // Custom JPQL queries
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.status = 'BORROWED'")
    long countActiveBorrows();

    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.status = 'OVERDUE' OR (br.status = 'BORROWED' AND br.dueDate < :now)")
    long countOverdueBorrows(@Param("now") LocalDateTime now);

    @Query("SELECT br FROM BorrowRecord br WHERE br.status = 'BORROWED' AND br.dueDate < :now")
    List<BorrowRecord> findActiveOverdueRecords(@Param("now") LocalDateTime now);

    @Query("SELECT br FROM BorrowRecord br LEFT JOIN FETCH br.student LEFT JOIN FETCH br.book ORDER BY br.borrowDate DESC")
    Page<BorrowRecord> findAllWithDetails(Pageable pageable);

    @Query("SELECT br FROM BorrowRecord br LEFT JOIN FETCH br.student LEFT JOIN FETCH br.book WHERE br.student.id = :studentId ORDER BY br.borrowDate DESC")
    List<BorrowRecord> findMyBorrowsWithDetails(@Param("studentId") Long studentId);
}
