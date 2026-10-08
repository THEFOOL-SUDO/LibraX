package com.library.lms.repository;

import com.library.lms.entity.BookRequest;
import com.library.lms.entity.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {

    List<BookRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    Page<BookRequest> findByStatus(RequestStatus status, Pageable pageable);

    long countByStatus(RequestStatus status);

    @Query("SELECT br FROM BookRequest br LEFT JOIN FETCH br.student ORDER BY br.createdAt DESC")
    List<BookRequest> findAllWithStudent();

    @Query("SELECT br FROM BookRequest br LEFT JOIN FETCH br.student WHERE br.student.id = :studentId ORDER BY br.createdAt DESC")
    List<BookRequest> findMyRequestsWithStudent(@Param("studentId") Long studentId);
}
