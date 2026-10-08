package com.library.lms.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.lms.entity.*;
import com.library.lms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FineRecordRepository fineRecordRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DataInitializer(UserRepository userRepository, BookRepository bookRepository, BorrowRecordRepository borrowRecordRepository, FineRecordRepository fineRecordRepository, PasswordEncoder passwordEncoder, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
        this.fineRecordRepository = fineRecordRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0 && bookRepository.count() > 0) {
            log.info("Database already contains data. Skipping initial seeding.");
            return;
        }

        log.info("Initializing sample library database records...");

        // 1. Seed Users
        User admin = userRepository.findByEmail("admin@library.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("Admin User")
                        .email("admin@library.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .role(Role.ADMIN)
                        .phone("+1234567890")
                        .isActive(true)
                        .build())
        );

        User john = userRepository.findByEmail("john@student.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("John Doe")
                        .email("john@student.com")
                        .password(passwordEncoder.encode("Student@123"))
                        .role(Role.STUDENT)
                        .studentId("STU001")
                        .phone("+1987654321")
                        .isActive(true)
                        .build())
        );

        User jane = userRepository.findByEmail("jane@student.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("Jane Smith")
                        .email("jane@student.com")
                        .password(passwordEncoder.encode("Student@123"))
                        .role(Role.STUDENT)
                        .studentId("STU002")
                        .phone("+1122334455")
                        .isActive(true)
                        .build())
        );

        log.info("Created users: Admin and 2 Students");

        // 2. Seed Books from books.json
        if (bookRepository.count() == 0) {
            try {
                ClassPathResource resource = new ClassPathResource("data/books.json");
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        List<Map<String, Object>> list = objectMapper.readValue(is, new TypeReference<>() {});
                        for (Map<String, Object> item : list) {
                            String isbnRaw = (String) item.get("isbn");
                            String isbnClean = isbnRaw != null ? isbnRaw.replaceAll("[^0-9Xx]", "") : "";

                            int total = ((Number) item.getOrDefault("totalCopies", 1)).intValue();
                            int avail = ((Number) item.getOrDefault("availableCopies", total)).intValue();

                            Book book = Book.builder()
                                    .title((String) item.get("title"))
                                    .author((String) item.get("author"))
                                    .isbn(isbnClean)
                                    .genre((String) item.get("genre"))
                                    .totalCopies(total)
                                    .availableCopies(avail)
                                    .coverImage((String) item.get("coverImage"))
                                    .description((String) item.get("description"))
                                    .addedByUser(admin)
                                    .build();
                            bookRepository.save(book);
                        }
                        log.info("Imported {} books from books.json", list.size());
                    }
                }
            } catch (Exception e) {
                log.error("Failed to load initial books.json: {}", e.getMessage());
            }
        }

        // 3. Seed Sample Borrow and Fine
        List<Book> books = bookRepository.findAll();
        if (!books.isEmpty() && borrowRecordRepository.count() == 0) {
            Book book1 = books.get(0);
            BorrowRecord borrow1 = BorrowRecord.builder()
                    .student(john)
                    .book(book1)
                    .borrowDate(LocalDateTime.now().minusDays(19))
                    .dueDate(LocalDateTime.now().minusDays(5))
                    .status(BorrowStatus.BORROWED)
                    .issuedBy(admin)
                    .build();
            borrow1 = borrowRecordRepository.save(borrow1);

            FineRecord overdueFine = FineRecord.builder()
                    .student(john)
                    .borrowRecord(borrow1)
                    .amount(BigDecimal.valueOf(25.00))
                    .reason("Overdue by 5 days")
                    .isPaid(false)
                    .build();
            fineRecordRepository.save(overdueFine);

            if (books.size() > 5) {
                Book book2 = books.get(5);
                BorrowRecord borrow2 = BorrowRecord.builder()
                        .student(jane)
                        .book(book2)
                        .borrowDate(LocalDateTime.now().minusDays(3))
                        .dueDate(LocalDateTime.now().plusDays(11))
                        .status(BorrowStatus.BORROWED)
                        .issuedBy(admin)
                        .build();
                borrowRecordRepository.save(borrow2);
            }

            log.info("Sample borrow and fine records seeded successfully.");
        }
    }
}
