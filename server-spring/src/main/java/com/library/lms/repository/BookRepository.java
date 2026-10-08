package com.library.lms.repository;

import com.library.lms.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    // Derived Queries
    Optional<Book> findByIsbn(String isbn);

    Page<Book> findByGenreIgnoreCase(String genre, Pageable pageable);

    // Derived search query with case-insensitive title or author
    Page<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(String title, String author, Pageable pageable);

    // Custom JPQL Queries with search and genre filter
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Book> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(b.author) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND LOWER(b.genre) = LOWER(:genre)")
    Page<Book> searchByKeywordAndGenre(@Param("keyword") String keyword, @Param("genre") String genre, Pageable pageable);

    @Query("SELECT DISTINCT b.genre FROM Book b WHERE b.genre IS NOT NULL ORDER BY b.genre ASC")
    List<String> findDistinctGenres();

    @Query("SELECT COALESCE(SUM(b.totalCopies), 0) FROM Book b")
    long sumTotalCopies();

    @Query("SELECT COALESCE(SUM(b.availableCopies), 0) FROM Book b")
    long sumAvailableCopies();
}
