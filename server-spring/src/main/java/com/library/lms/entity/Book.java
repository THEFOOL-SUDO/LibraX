package com.library.lms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 200)
    private String author;

    @Column(nullable = false, length = 50)
    private String isbn;

    @Column(nullable = false, length = 100)
    private String genre;

    @Column(name = "total_copies", nullable = false)
    private Integer totalCopies;

    @Column(name = "available_copies", nullable = false)
    private Integer availableCopies;

    @Column(name = "cover_image", length = 1000)
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by")
    private User addedByUser;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Book() {
    }

    public Book(Long id, String title, String author, String isbn, String genre, Integer totalCopies, Integer availableCopies, String coverImage, String description, User addedByUser, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.coverImage = coverImage;
        this.description = description;
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
        private User addedByUser;
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
        public Builder addedByUser(User addedByUser) { this.addedByUser = addedByUser; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Book build() {
            return new Book(id, title, author, isbn, genre, totalCopies, availableCopies, coverImage, description, addedByUser, createdAt, updatedAt);
        }
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
    public User getAddedByUser() { return addedByUser; }
    public void setAddedByUser(User addedByUser) { this.addedByUser = addedByUser; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
