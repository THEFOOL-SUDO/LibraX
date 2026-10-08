package com.library.lms.dto;

import java.util.List;

public class BorrowPageResponse {
    private List<BorrowRecordDto> borrows;
    private List<BorrowRecordDto> content;
    private long total;
    private int page;
    private int totalPages;

    public BorrowPageResponse() {}

    public BorrowPageResponse(List<BorrowRecordDto> borrows, long total, int page, int totalPages) {
        this.borrows = borrows;
        this.content = borrows;
        this.total = total;
        this.page = page;
        this.totalPages = totalPages;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<BorrowRecordDto> borrows;
        private long total;
        private int page;
        private int totalPages;

        public Builder borrows(List<BorrowRecordDto> borrows) {
            this.borrows = borrows;
            return this;
        }

        public Builder total(long total) {
            this.total = total;
            return this;
        }

        public Builder page(int page) {
            this.page = page;
            return this;
        }

        public Builder totalPages(int totalPages) {
            this.totalPages = totalPages;
            return this;
        }

        public BorrowPageResponse build() {
            return new BorrowPageResponse(borrows, total, page, totalPages);
        }
    }

    public List<BorrowRecordDto> getBorrows() { return borrows; }
    public void setBorrows(List<BorrowRecordDto> borrows) { 
        this.borrows = borrows; 
        this.content = borrows;
    }

    public List<BorrowRecordDto> getContent() { return content; }
    public void setContent(List<BorrowRecordDto> content) { 
        this.content = content; 
        this.borrows = content;
    }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
}
