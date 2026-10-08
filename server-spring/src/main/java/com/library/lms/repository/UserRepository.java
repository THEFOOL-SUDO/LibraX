package com.library.lms.repository;

import com.library.lms.entity.Role;
import com.library.lms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Derived JPA Queries
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(Role role, Pageable pageable);

    long countByRole(Role role);

    // Custom JPQL Query
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = :isActive ORDER BY u.name ASC")
    List<User> findActiveUsersByRole(@Param("role") Role role, @Param("isActive") Boolean isActive);

    @Query("SELECT u FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.studentId) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<User> searchStudents(@Param("query") String query, Pageable pageable);
}
