package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.GenreRequest;
import com.example.systemsanalysisfinalproject.Model.Genre;
import com.example.systemsanalysisfinalproject.Repository.GenreRepository;
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

class GenreControllerTest {

    private MockMvc mockMvc;
    // Note: If your groupmate used GenreService instead of GenreRepository,
    // just change these two words to GenreService!
    private GenreRepository genreRepository;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        genreRepository = Mockito.mock(GenreRepository.class);
        GenreController controller = new GenreController(genreRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("GET /api/v1/genres/{id} - Should return a genre by ID")
    void getGenreById_ShouldReturnGenre() throws Exception {
        Long genreId = 1L;
        when(genreRepository.findById(genreId)).thenReturn(Optional.of(new Genre()));

        mockMvc.perform(get("/api/v1/genres/{id}", genreId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/v1/genres - Should create a genre")
    void createGenre_ShouldReturnCreated() throws Exception {
        GenreRequest request = new GenreRequest();
        request.setName("Science Fiction");

        when(genreRepository.existsByName(any())).thenReturn(false);
        when(genreRepository.save(any())).thenReturn(new Genre());

        mockMvc.perform(post("/api/v1/genres")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}