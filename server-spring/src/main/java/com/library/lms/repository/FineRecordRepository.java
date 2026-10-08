package com.library.lms.repository;

import com.library.lms.entity.FineRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FineRecordRepository extends JpaRepository<FineRecord, Long> {

    // Derived Queries
    List<FineRecord> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<FineRecord> findByIsPaidFalse();

    void deleteByBorrowRecordId(Long borrowRecordId);

    Page<FineRecord> findByIsPaid(Boolean isPaid, Pageable pageable);

    // Custom JPQL queries
    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FineRecord f WHERE f.student.id = :studentId AND f.isPaid = false")
    BigDecimal sumUnpaidFinesByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FineRecord f WHERE f.isPaid = false")
    BigDecimal sumTotalPendingFines();

    @Query("SELECT COALESCE(SUM(f.amount), 0) FROM FineRecord f WHERE f.isPaid = true")
    BigDecimal sumTotalCollectedFines();

    @Query("SELECT f FROM FineRecord f LEFT JOIN FETCH f.student LEFT JOIN FETCH f.borrowRecord br LEFT JOIN FETCH br.book ORDER BY f.createdAt DESC")
    List<FineRecord> findAllWithDetails();

    @Query("SELECT f FROM FineRecord f LEFT JOIN FETCH f.student LEFT JOIN FETCH f.borrowRecord br LEFT JOIN FETCH br.book WHERE f.student.id = :studentId ORDER BY f.createdAt DESC")
    List<FineRecord> findMyFinesWithDetails(@Param("studentId") Long studentId);
}
