package com.library.lms.dto;

import java.util.List;

public class BookPageResponse {
    private List<BookDto> books;
    private long total;
    private int page;
    private int totalPages;

    public BookPageResponse() {}

    public BookPageResponse(List<BookDto> books, long total, int page, int totalPages) {
        this.books = books;
        this.total = total;
        this.page = page;
        this.totalPages = totalPages;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<BookDto> books;
        private long total;
        private int page;
        private int totalPages;

        public Builder books(List<BookDto> books) { this.books = books; return this; }
        public Builder total(long total) { this.total = total; return this; }
        public Builder page(int page) { this.page = page; return this; }
        public Builder totalPages(int totalPages) { this.totalPages = totalPages; return this; }

        public BookPageResponse build() {
            return new BookPageResponse(books, total, page, totalPages);
        }
    }

    public List<BookDto> getBooks() { return books; }
    public void setBooks(List<BookDto> books) { this.books = books; }
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
}
