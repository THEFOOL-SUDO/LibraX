package com.library.lms.service;

import com.library.lms.dto.BookDto;
import com.library.lms.dto.BookPageResponse;
import com.library.lms.entity.User;

import java.util.List;

public interface BookService {
    BookPageResponse getBooks(String search, String genre, int page, int limit, String sortBy, String sortOrder);
    BookDto getBookById(Long id);
    BookDto createBook(BookDto bookDto, User currentUser);
    BookDto updateBook(Long id, BookDto bookDto);
    void deleteBook(Long id);
    List<String> getGenres();
}
