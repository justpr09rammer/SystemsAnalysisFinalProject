package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.AuthorRequest;
import com.example.systemsanalysisfinalproject.Model.Author;
import com.example.systemsanalysisfinalproject.Repository.AuthorRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthorControllerTest {

    private MockMvc mockMvc;
    // Note: If your groupmate used AuthorService instead of AuthorRepository,
    // just change these two words to AuthorService!
    private AuthorRepository authorRepository;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        authorRepository = Mockito.mock(AuthorRepository.class);
        AuthorController controller = new AuthorController(authorRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("GET /api/v1/authors/{id} - Should return an author by ID")
    void getAuthorById_ShouldReturnAuthor() throws Exception {
        Long authorId = 1L;
        when(authorRepository.findById(authorId)).thenReturn(Optional.of(new Author()));

        mockMvc.perform(get("/api/v1/authors/{id}", authorId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/v1/authors - Should create an author")
    void createAuthor_ShouldReturnCreated() throws Exception {
        AuthorRequest request = new AuthorRequest();
        request.setName("Isaac Asimov");

        when(authorRepository.save(any())).thenReturn(new Author());

        mockMvc.perform(post("/api/v1/authors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}