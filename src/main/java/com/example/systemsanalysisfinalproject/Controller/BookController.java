package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.BookRequest;
import com.example.systemsanalysisfinalproject.DTOs.BookResponse;
import com.example.systemsanalysisfinalproject.Model.Book;
import com.example.systemsanalysisfinalproject.Service.BookService;
import com.example.systemsanalysisfinalproject.Service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Browse, search and manage books")
public class BookController {
 
    private final BookService bookService;
    private final RecommendationService recommendationService;
 
    @Operation(summary = "Get all books with pagination")
    @GetMapping
    public Page<Book> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String dir) {
        Sort sort = dir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return bookService.getAllBooks(PageRequest.of(page, size, sort));
    }
 
    @Operation(summary = "Get book by ID")
    @GetMapping("/{bookId}")
    public BookResponse getBookById(@PathVariable Long bookId) {
        return bookService.getBookById(bookId);
    }

    @Operation(summary = "Search books by title or author")
    @GetMapping("/search")
    public List<BookResponse> searchBooks(@RequestParam String q) {
        return bookService.searchBooks(q);
    }

//    @GetMapping("/search")
//    public Page<BookResponse> searchBooks(
//            @RequestParam String q,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size) {
//        return bookService.searchBooks(q, PageRequest.of(page, size));
//    }
 
    @Operation(summary = "Get top-rated books")
    @GetMapping("/top-rated")
    public Page<Book> getTopRated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return bookService.getTopRated(PageRequest.of(page, size));
    }
 
    @Operation(summary = "Get books by genre")
    @GetMapping("/genre/{genreId}")
    public Page<Book> getBooksByGenre(
            @PathVariable Long genreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return bookService.findByGenre(genreId, PageRequest.of(page, size));
    }
 
    @Operation(summary = "Get books by author")
    @GetMapping("/author/{authorId}")
    public Page<Book> getBooksByAuthor(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return bookService.findByAuthor(authorId, PageRequest.of(page, size));
    }
 
    @Operation(summary = "Get similar books")
    @GetMapping("/{bookId}/similar")
    public List<Book> getSimilarBooks(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "10") int limit) {
        return recommendationService.getSimilarBooks(bookId, limit);
    }
 
    @Operation(summary = "Get personalized recommendations")
    @GetMapping("/recommendations")
    public List<Book> getRecommendations(@RequestParam(defaultValue = "20") int limit) {
        return recommendationService.getRecommendations(limit);
    }
 
    @Operation(summary = "Import books from OpenLibrary (Admin)")
    @PostMapping("/import")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public List<Book> importFromOpenLibrary(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit) {
        return bookService.importFromOpenLibrary(query, limit);
    }
 
    @Operation(summary = "Create a book manually (Admin)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Book createBook(@Valid @RequestBody BookRequest request) {
        return bookService.createBook(request);
    }
 
    @Operation(summary = "Update a book (Admin)")
    @PutMapping("/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Book updateBook(@PathVariable Long bookId, @Valid @RequestBody BookRequest request) {
        return bookService.updateBook(bookId, request);
    }
 
    @Operation(summary = "Delete a book (Admin)")
    @DeleteMapping("/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBook(@PathVariable Long bookId) {
        bookService.deleteBook(bookId);
    }
}