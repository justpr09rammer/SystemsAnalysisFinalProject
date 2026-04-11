package com.example.systemsanalysisfinalproject.Service;

import com.example.systemsanalysisfinalproject.DTOs.BookRequest;
import com.example.systemsanalysisfinalproject.DTOs.BookResponse;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);
    private static final String OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json?q=";

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final GenreRepository genreRepository;
    private final ShelfBookRepository shelfBookRepository;
    private final ShelfRepository shelfRepository;
    private final ReviewRepository reviewRepository;
    private final ReadingProgressRepository progressRepository;
    private final UserService userService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // ---- CRUD ----

    @Transactional(readOnly = true)
    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public BookResponse getBookById(Long bookId) {
        Book book = findBookOrThrow(bookId);
        return enrichBook(book);
    }

    //    @Transactional(readOnly = true)
//    public Page<BookResponse> searchBooks(String query, Pageable pageable) {
//        Page<Book> books = bookRepository.search(query, pageable);
//        return books.map(this::enrichBook);
//    }
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<BookResponse> searchBooks(String query) {
        try {
            String url = OPEN_LIBRARY_SEARCH + query.replace(" ", "+") + "&fields=key,title,author_name,cover_i,first_publish_year,language,number_of_pages_median,ratings_average,ratings_count,isbn";

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode docs = root.path("docs");

            List<BookResponse> results = new ArrayList<>();

            if (docs.isArray()) {
                for (JsonNode doc : docs) {
                    // Map API doc -> Book Entity
                    Book book = mapToBookModel(doc);

                    // Map Book Entity -> BookResponse DTO
                    results.add(enrichBook(book));
                }
            }
            return results;
        } catch (Exception e) {
            logger.error("Search failed", e);
            return Collections.emptyList();
        }
    }

    private Book mapToBookModel(JsonNode doc) {
        Book book = Book.builder()
                .title(doc.path("title").asText())
                .openLibraryId(doc.path("key").asText().replace("/works/", "")) // Extracting ID
                .description(doc.path("first_sentence").isArray() ? doc.path("first_sentence").get(0).asText() : null)
                .pageCount(doc.path("edition_count").asInt()) // OpenLibrary search uses edition_count or median
                .averageRating(doc.path("ratings_average").asDouble(0.0))
                .ratingsCount(doc.path("ratings_count").asInt(0))
                .coverImageUrl(doc.has("cover_i") ?
                        "https://covers.openlibrary.org/b/id/" + doc.get("cover_i").asInt() + "-L.jpg" : null)
                .build();

        // 1. Map ISBNs (OpenLibrary usually provides arrays)
        if (doc.has("isbn")) {
            JsonNode isbns = doc.get("isbn");
            if (isbns.isArray() && isbns.size() > 0) {
                // Very basic logic: take the first one or filter by length
                book.setIsbn13(isbns.get(0).asText());
            }
        }

        // 2. Map Language (Usually a list of codes like ["eng", "spa"])
        if (doc.has("language")) {
            book.setLanguage(doc.get("language").path(0).asText());
        }

        // 3. Map Published Date
        if (doc.has("first_publish_year")) {
            // OpenLibrary search gives year; LocalDate needs month/day so we default to Jan 1st
            int year = doc.get("first_publish_year").asInt();
            book.setPublishedDate(LocalDate.of(year, 1, 1));
        }

        // 4. Map Authors (ManyToMany)
        if (doc.has("author_name")) {
            List<Author> authorList = new ArrayList<>();
            doc.get("author_name").forEach(name -> {
                Author author = new Author();
                author.setName(name.asText());
                authorList.add(author);
            });
            book.setAuthors(authorList);
        }

        return book;
    }

    @Transactional(readOnly = true)
    public Page<Book> findByGenre(Long genreId, Pageable pageable) {
        return bookRepository.findByGenreId(genreId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Book> findByAuthor(Long authorId, Pageable pageable) {
        return bookRepository.findByAuthorId(authorId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Book> getTopRated(Pageable pageable) {
        return bookRepository.findTopRated(pageable);
    }

    public Book createBook(BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .isbn10(request.getIsbn10())
                .isbn13(request.getIsbn13())
                .pageCount(request.getPageCount())
                .publishedDate(request.getPublishedDate())
                .language(request.getLanguage())
                .openLibraryId(request.getOpenLibraryId())
                .ratingsCount(0)
                .averageRating(0.0)
                .build();

        if (request.getAuthorIds() != null) {
            List<Author> authors = authorRepository.findAllById(request.getAuthorIds());
            book.setAuthors(authors);
        }
        if (request.getGenreIds() != null) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            book.setGenres(genres);
        }

        return bookRepository.save(book);
    }

    public Book updateBook(Long bookId, BookRequest request) {
        Book book = findBookOrThrow(bookId);
        if (request.getTitle() != null) book.setTitle(request.getTitle());
        if (request.getDescription() != null) book.setDescription(request.getDescription());
        if (request.getCoverImageUrl() != null) book.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getIsbn10() != null) book.setIsbn10(request.getIsbn10());
        if (request.getIsbn13() != null) book.setIsbn13(request.getIsbn13());
        if (request.getPageCount() != null) book.setPageCount(request.getPageCount());
        if (request.getPublishedDate() != null) book.setPublishedDate(request.getPublishedDate());
        if (request.getLanguage() != null) book.setLanguage(request.getLanguage());
        if (request.getAuthorIds() != null) book.setAuthors(authorRepository.findAllById(request.getAuthorIds()));
        if (request.getGenreIds() != null) book.setGenres(genreRepository.findAllById(request.getGenreIds()));
        return bookRepository.save(book);
    }

    public void deleteBook(Long bookId) {
        if (!bookRepository.existsById(bookId)) {
            throw new NoSuchElementException("Book not found with id: " + bookId);
        }
        bookRepository.deleteById(bookId);
    }

    // ---- OpenLibrary import ----

    public List<Book> importFromOpenLibrary(String query, int limit) {
        List<Book> imported = new ArrayList<>();
        try {
            String url = OPEN_LIBRARY_SEARCH + query.replace(" ", "+") + "&limit=" + limit;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            // Fixed: use standard Jackson ObjectMapper from com.fasterxml.jackson
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode docs = root.path("docs");

            if (docs.isMissingNode() || !docs.isArray()) return imported;

            for (JsonNode doc : docs) {
                try {
                    imported.add(importSingleDoc(doc));
                } catch (Exception e) {
                    logger.warn("Failed to import doc: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("OpenLibrary import failed for query '{}': {}", query, e.getMessage());
            throw new RuntimeException("Failed to import from OpenLibrary", e);
        }
        return imported;
    }

    private Book importSingleDoc(JsonNode doc) {
        String workId = doc.has("key") ? doc.get("key").asText() : null;
        if (workId != null) {
            Optional<Book> existing = bookRepository.findByOpenLibraryId(workId);
            if (existing.isPresent()) return existing.get();
        }

        String title = doc.has("title") ? doc.get("title").asText() : "Unknown Title";
        Integer pageCount = doc.has("number_of_pages_median") ? doc.get("number_of_pages_median").asInt() : null;
        Double rating = doc.has("ratings_average") ? doc.get("ratings_average").asDouble() : null;
        Integer ratingsCount = doc.has("ratings_count") ? doc.get("ratings_count").asInt() : null;

        String coverUrl = null;
        if (doc.has("cover_i")) {
            coverUrl = "https://covers.openlibrary.org/b/id/" + doc.get("cover_i").asInt() + "-L.jpg";
        }

        List<Author> authors = new ArrayList<>();
        if (doc.has("author_name")) {
            for (JsonNode aNode : doc.get("author_name")) {
                String authorName = aNode.asText();
                Author author = authorRepository.findByName(authorName).orElseGet(() ->
                        authorRepository.save(Author.builder().name(authorName).build()));
                authors.add(author);
            }
        }

        List<Genre> genres = new ArrayList<>();
        if (doc.has("subject")) {
            int count = 0;
            for (JsonNode sNode : doc.get("subject")) {
                if (count++ >= 3) break;
                String genreName = sNode.asText().toLowerCase();
                if (genreName.length() > 50) continue;
                Genre genre = genreRepository.findByName(genreName).orElseGet(() ->
                        genreRepository.save(Genre.builder().name(genreName).build()));
                genres.add(genre);
            }
        }

        Book book = Book.builder()
                .title(title)
                .openLibraryId(workId)
                .pageCount(pageCount)
                .averageRating(rating)
                .ratingsCount(ratingsCount)
                .coverImageUrl(coverUrl)
                .language("en")
                .authors(authors)
                .genres(genres)
                .build();

        return bookRepository.save(book);
    }

    // ---- Rating recalculation ----

    public void recalculateRating(Long bookId) {
        Double avg = reviewRepository.findAverageRatingByBookId(bookId);
        Long count = reviewRepository.countByBookId(bookId);
        Book book = findBookOrThrow(bookId);
        book.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        book.setRatingsCount(count != null ? count.intValue() : 0);
        bookRepository.save(book);
    }

    // ---- Enrich with user-specific data ----

    private BookResponse enrichBook(Book book) {
        BookResponse resp = BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .description(book.getDescription())
                .coverImageUrl(book.getCoverImageUrl())
                .isbn10(book.getIsbn10())
                .isbn13(book.getIsbn13())
                .pageCount(book.getPageCount())
                .publishedDate(book.getPublishedDate())
                .language(book.getLanguage())
                .averageRating(book.getAverageRating())
                .ratingsCount(book.getRatingsCount())
                .authors(book.getAuthors())
                .genres(book.getGenres())
                .build();

        try {
            User current = userService.getCurrentUser();
            List<ShelfBook> userShelfBooks = shelfBookRepository.findByUserIdAndBookId(current.getId(), book.getId());
            resp.setUserShelves(userShelfBooks.stream()
                    .map(sb -> sb.getShelf().getName())
                    .collect(Collectors.toList()));

            reviewRepository.findByUserIdAndBookId(current.getId(), book.getId())
                    .ifPresent(r -> resp.setUserRating(r.getRating()));

            progressRepository.findByUserIdAndBookId(current.getId(), book.getId())
                    .ifPresent(p -> resp.setUserReadingPercent(p.getPercentComplete()));
        } catch (Exception ignored) {
            // Unauthenticated
        }

        return resp;
    }

    public Book findBookOrThrow(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found with id: " + bookId));
    }
}