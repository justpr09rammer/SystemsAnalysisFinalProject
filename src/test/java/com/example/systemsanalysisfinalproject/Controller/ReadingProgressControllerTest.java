package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.ReadingChallengeRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReadingProgressRequest;
import com.example.systemsanalysisfinalproject.Model.ReadingChallenge;
import com.example.systemsanalysisfinalproject.Model.ReadingProgress;
import com.example.systemsanalysisfinalproject.Service.ReadingProgressService;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReadingProgressControllerTest {

    private MockMvc mockMvc;
    private ReadingProgressService progressService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // 1. Mock the underlying service
        progressService = Mockito.mock(ReadingProgressService.class);

        // 2. Inject it into the controller
        ReadingProgressController controller = new ReadingProgressController(progressService);

        // 3. Build the isolated standalone MockMvc environment
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    // --- PROGRESS TESTS ---

    @Test
    @DisplayName("GET /api/v1/reading/progress - Should return list of user's progress")
    void getMyProgress_ShouldReturnList() throws Exception {
        ReadingProgress progress1 = new ReadingProgress();
        ReadingProgress progress2 = new ReadingProgress();

        when(progressService.getCurrentUserProgress()).thenReturn(Arrays.asList(progress1, progress2));

        mockMvc.perform(get("/api/v1/reading/progress")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }

    @Test
    @DisplayName("POST /api/v1/reading/progress/{bookId} - Should upsert progress")
    void upsertProgress_ShouldReturnProgress() throws Exception {
        Long bookId = 1L;
        ReadingProgressRequest request = new ReadingProgressRequest();
        // Assuming request fields are populated here

        ReadingProgress mockProgress = new ReadingProgress();

        when(progressService.upsertProgress(eq(bookId), any(ReadingProgressRequest.class)))
                .thenReturn(mockProgress);

        mockMvc.perform(post("/api/v1/reading/progress/{bookId}", bookId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    // --- CHALLENGE TESTS ---

    @Test
    @DisplayName("GET /api/v1/reading/challenges/{year} - Should return challenge for specific year")
    void getChallengeForYear_ShouldReturnChallenge() throws Exception {
        Integer year = 2026;
        ReadingChallenge mockChallenge = new ReadingChallenge();

        when(progressService.getChallengeForYear(year)).thenReturn(mockChallenge);

        mockMvc.perform(get("/api/v1/reading/challenges/{year}", year)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/v1/reading/challenges - Should create or update challenge")
    void createOrUpdateChallenge_ShouldReturnCreated() throws Exception {
        ReadingChallengeRequest request = new ReadingChallengeRequest();
        ReadingChallenge mockChallenge = new ReadingChallenge();

        when(progressService.createOrUpdateChallenge(any(ReadingChallengeRequest.class)))
                .thenReturn(mockChallenge);

        mockMvc.perform(post("/api/v1/reading/challenges")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}