package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.ShelfRequest;
import com.example.systemsanalysisfinalproject.Model.Shelf;
import com.example.systemsanalysisfinalproject.Model.ShelfBook;
import com.example.systemsanalysisfinalproject.Service.ShelfService;
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

class ShelfControllerTest {

    private MockMvc mockMvc;
    private ShelfService shelfService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // 1. Mock the underlying service
        shelfService = Mockito.mock(ShelfService.class);

        // 2. Inject it into the controller
        ShelfController controller = new ShelfController(shelfService);

        // 3. Build the isolated standalone MockMvc environment
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("GET /api/v1/shelves - Should return current user's shelves")
    void getMyShelves_ShouldReturnList() throws Exception {
        Shelf shelf1 = new Shelf();
        Shelf shelf2 = new Shelf();

        when(shelfService.getCurrentUserShelves()).thenReturn(Arrays.asList(shelf1, shelf2));

        mockMvc.perform(get("/api/v1/shelves")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("POST /api/v1/shelves - Should create a custom shelf")
    void createShelf_ShouldReturnCreated() throws Exception {
        ShelfRequest request = new ShelfRequest();
        // Assuming request fields are populated
        Shelf mockShelf = new Shelf();

        when(shelfService.createCustomShelf(any(ShelfRequest.class))).thenReturn(mockShelf);

        mockMvc.perform(post("/api/v1/shelves")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/v1/shelves/want-to-read/{bookId} - Should add book to shelf")
    void addToWantToRead_ShouldReturnCreated() throws Exception {
        Long bookId = 1L;
        ShelfBook mockShelfBook = new ShelfBook();

        when(shelfService.addToWantToRead(bookId)).thenReturn(mockShelfBook);

        mockMvc.perform(post("/api/v1/shelves/want-to-read/{bookId}", bookId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }
}