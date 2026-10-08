package com.library.lms.controller;

import com.library.lms.dto.BookDto;
import com.library.lms.dto.BookPageResponse;
import com.library.lms.entity.User;
import com.library.lms.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Books", description = "Endpoints for catalog management, CRUD, pagination, and searching")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    @Operation(summary = "Get paginated book list", description = "Supports keyword search, genre filter, pagination, and sorting")
    public ResponseEntity<BookPageResponse> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder) {

        BookPageResponse response = bookService.getBooks(search, genre, page, limit, sortBy, sortOrder);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/genres")
    @Operation(summary = "Get all distinct book genres", description = "Retrieves unique genres present in the catalog")
    public ResponseEntity<List<String>> getGenres() {
        return ResponseEntity.ok(bookService.getGenres());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID", description = "Fetches complete details for a specific book")
    public ResponseEntity<BookDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new book", description = "Admin only: creates a new book in the catalog")
    public ResponseEntity<BookDto> createBook(
            @Valid @RequestBody BookDto bookDto,
            @AuthenticationPrincipal User currentUser) {
        BookDto created = bookService.createBook(bookDto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing book", description = "Admin only: modifies book metadata and copies")
    public ResponseEntity<BookDto> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookDto bookDto) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete book", description = "Admin only: removes a book from the catalog if not currently borrowed")
    public ResponseEntity<Map<String, String>> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(Map.of("message", "Book deleted successfully"));
    }
}
