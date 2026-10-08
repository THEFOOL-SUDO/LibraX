package com.library.lms.service.impl;

import com.library.lms.dto.BookDto;
import com.library.lms.dto.BookPageResponse;
import com.library.lms.entity.Book;
import com.library.lms.entity.BorrowRecord;
import com.library.lms.entity.BorrowStatus;
import com.library.lms.entity.User;
import com.library.lms.exception.BadRequestException;
import com.library.lms.exception.ResourceNotFoundException;
import com.library.lms.repository.BookRepository;
import com.library.lms.repository.BorrowRecordRepository;
import com.library.lms.service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private static final Logger log = LoggerFactory.getLogger(BookServiceImpl.class);

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final com.library.lms.repository.FineRecordRepository fineRecordRepository;

    public BookServiceImpl(BookRepository bookRepository, 
                           BorrowRecordRepository borrowRecordRepository,
                           com.library.lms.repository.FineRecordRepository fineRecordRepository) {
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.fineRecordRepository = fineRecordRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public BookPageResponse getBooks(String search, String genre, int page, int limit, String sortBy, String sortOrder) {
        int pageIndex = Math.max(0, page - 1);
        int pageSize = Math.max(1, limit);

        Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String property = (sortBy != null && !sortBy.isBlank()) ? sortBy : "createdAt";

        Sort sort = Sort.by(direction, property);
        Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);

        Page<Book> bookPage;
        boolean hasSearch = search != null && !search.trim().isBlank();
        boolean hasGenre = genre != null && !genre.trim().isBlank() && !"all".equalsIgnoreCase(genre.trim());

        if (hasSearch && hasGenre) {
            bookPage = bookRepository.searchByKeywordAndGenre(search.trim(), genre.trim(), pageable);
        } else if (hasSearch) {
            bookPage = bookRepository.searchByKeyword(search.trim(), pageable);
        } else if (hasGenre) {
            bookPage = bookRepository.findByGenreIgnoreCase(genre.trim(), pageable);
        } else {
            bookPage = bookRepository.findAll(pageable);
        }

        List<BookDto> books = bookPage.getContent().stream()
                .map(BookDto::fromEntity)
                .toList();

        return BookPageResponse.builder()
                .books(books)
                .total(bookPage.getTotalElements())
                .page(page)
                .totalPages(bookPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BookDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));
        return BookDto.fromEntity(book);
    }

    @Override
    @Transactional
    public BookDto createBook(BookDto bookDto, User currentUser) {
        log.info("Creating new book: {}", bookDto.getTitle());

        String cleanIsbn = bookDto.getIsbn().replaceAll("[^0-9Xx]", "");
        if (bookRepository.findByIsbn(cleanIsbn).isPresent()) {
            throw new BadRequestException("A book with this ISBN already exists");
        }

        int total = bookDto.getTotalCopies() != null ? bookDto.getTotalCopies() : 1;
        int available = bookDto.getAvailableCopies() != null ? bookDto.getAvailableCopies() : total;

        Book book = Book.builder()
                .title(bookDto.getTitle().trim())
                .author(bookDto.getAuthor().trim())
                .isbn(cleanIsbn)
                .genre(bookDto.getGenre().trim())
                .totalCopies(total)
                .availableCopies(available)
                .coverImage(bookDto.getCoverImage())
                .description(bookDto.getDescription())
                .addedByUser(currentUser)
                .build();

        book = bookRepository.save(book);
        log.info("Book created with ID: {}", book.getId());
        return BookDto.fromEntity(book);
    }

    @Override
    @Transactional
    public BookDto updateBook(Long id, BookDto bookDto) {
        log.info("Updating book ID: {}", id);

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        if (bookDto.getTitle() != null) book.setTitle(bookDto.getTitle().trim());
        if (bookDto.getAuthor() != null) book.setAuthor(bookDto.getAuthor().trim());
        if (bookDto.getGenre() != null) book.setGenre(bookDto.getGenre().trim());
        if (bookDto.getDescription() != null) book.setDescription(bookDto.getDescription());
        if (bookDto.getCoverImage() != null) book.setCoverImage(bookDto.getCoverImage());

        if (bookDto.getTotalCopies() != null) {
            int oldTotal = book.getTotalCopies();
            int newTotal = bookDto.getTotalCopies();
            int diff = newTotal - oldTotal;
            book.setTotalCopies(newTotal);
            book.setAvailableCopies(Math.max(0, book.getAvailableCopies() + diff));
        }

        book = bookRepository.save(book);
        return BookDto.fromEntity(book);
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        log.info("Deleting book ID: {}", id);

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + id));

        List<BorrowRecord> history = borrowRecordRepository.findByBookId(id);
        boolean hasActiveBorrows = history.stream().anyMatch(br -> br.getStatus() == BorrowStatus.BORROWED);

        if (hasActiveBorrows) {
            throw new BadRequestException("Cannot delete book with active borrow records");
        }

        for (BorrowRecord br : history) {
            fineRecordRepository.deleteByBorrowRecordId(br.getId());
            borrowRecordRepository.delete(br);
        }

        bookRepository.delete(book);
        log.info("Book deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getGenres() {
        return bookRepository.findDistinctGenres();
    }
}
