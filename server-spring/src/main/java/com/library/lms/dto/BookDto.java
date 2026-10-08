package com.library.lms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.library.lms.entity.Book;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    @NotBlank(message = "ISBN is required")
    private String isbn;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotNull(message = "Total copies is required")
    @Min(value = 1, message = "Total copies must be at least 1")
    private Integer totalCopies;

    private Integer availableCopies;
    private String coverImage;
    private String description;
    private Long addedBy;
    private Map<String, String> addedByUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookDto() {}

    public BookDto(Long id, String title, String author, String isbn, String genre, Integer totalCopies, Integer availableCopies, String coverImage, String description, Long addedBy, Map<String, String> addedByUser, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.coverImage = coverImage;
        this.description = description;
        this.addedBy = addedBy;
        this.addedByUser = addedByUser;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String title;
        private String author;
        private String isbn;
        private String genre;
        private Integer totalCopies;
        private Integer availableCopies;
        private String coverImage;
        private String description;
        private Long addedBy;
        private Map<String, String> addedByUser;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder author(String author) { this.author = author; return this; }
        public Builder isbn(String isbn) { this.isbn = isbn; return this; }
        public Builder genre(String genre) { this.genre = genre; return this; }
        public Builder totalCopies(Integer totalCopies) { this.totalCopies = totalCopies; return this; }
        public Builder availableCopies(Integer availableCopies) { this.availableCopies = availableCopies; return this; }
        public Builder coverImage(String coverImage) { this.coverImage = coverImage; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder addedBy(Long addedBy) { this.addedBy = addedBy; return this; }
        public Builder addedByUser(Map<String, String> addedByUser) { this.addedByUser = addedByUser; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public BookDto build() {
            return new BookDto(id, title, author, isbn, genre, totalCopies, availableCopies, coverImage, description, addedBy, addedByUser, createdAt, updatedAt);
        }
    }

    public static BookDto fromEntity(Book book) {
        if (book == null) return null;
        Map<String, String> addedUserMap = null;
        if (book.getAddedByUser() != null) {
            addedUserMap = Map.of("name", book.getAddedByUser().getName());
        }

        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .genre(book.getGenre())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .coverImage(book.getCoverImage())
                .description(book.getDescription())
                .addedBy(book.getAddedByUser() != null ? book.getAddedByUser().getId() : null)
                .addedByUser(addedUserMap)
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public Integer getTotalCopies() { return totalCopies; }
    public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }
    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getAddedBy() { return addedBy; }
    public void setAddedBy(Long addedBy) { this.addedBy = addedBy; }
    public Map<String, String> getAddedByUser() { return addedByUser; }
    public void setAddedByUser(Map<String, String> addedByUser) { this.addedByUser = addedByUser; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
