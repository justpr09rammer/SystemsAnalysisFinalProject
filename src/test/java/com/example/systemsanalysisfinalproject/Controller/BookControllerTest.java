package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.BookRequest;
import com.example.systemsanalysisfinalproject.DTOs.BookResponse;
import com.example.systemsanalysisfinalproject.Model.Book;
import com.example.systemsanalysisfinalproject.Service.BookService;
import com.example.systemsanalysisfinalproject.Service.RecommendationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class BookControllerTest {

    private MockMvc mockMvc;
    private BookService bookService;
    private RecommendationService recommendationService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // 1. Manually mock the underlying services
        bookService = Mockito.mock(BookService.class);
        recommendationService = Mockito.mock(RecommendationService.class);

        // 2. Inject them directly into a new controller instance
        BookController bookController = new BookController(bookService, recommendationService);

        // 3. Build the isolated MockMvc environment (bypassing Spring Security and Context)
        mockMvc = MockMvcBuilders.standaloneSetup(bookController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("GET /api/v1/books/{bookId} - Should return a book successfully")
    void getBookById_ShouldReturnBook() throws Exception {
        Long bookId = 1L;
        BookResponse mockResponse = new BookResponse();

        when(bookService.getBookById(bookId)).thenReturn(mockResponse);

        mockMvc.perform(get("/api/v1/books/{bookId}", bookId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/v1/books/search - Should return list of books")
    void searchBooks_ShouldReturnList() throws Exception {
        String searchQuery = "Harry Potter";
        BookResponse book1 = new BookResponse();
        BookResponse book2 = new BookResponse();

        when(bookService.searchBooks(searchQuery)).thenReturn(Arrays.asList(book1, book2));

        mockMvc.perform(get("/api/v1/books/search")
                        .param("q", searchQuery)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("POST /api/v1/books - Admin can create a book")
    void createBook_AsAdmin_ShouldReturnCreated() throws Exception {
        BookRequest request = new BookRequest();
        Book mockSavedBook = new Book();

        when(bookService.createBook(any(BookRequest.class))).thenReturn(mockSavedBook);

        mockMvc.perform(post("/api/v1/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}