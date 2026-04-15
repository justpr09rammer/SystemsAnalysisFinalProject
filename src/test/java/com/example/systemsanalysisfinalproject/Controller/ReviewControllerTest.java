package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.ReviewRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReviewResponse;
import com.example.systemsanalysisfinalproject.Service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ReviewControllerTest {

    private MockMvc mockMvc;
    private ReviewService reviewService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        reviewService = Mockito.mock(ReviewService.class);
        ReviewController controller = new ReviewController(reviewService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("GET /api/v1/reviews/{reviewId} - Should return a single review")
    void getReviewById_ShouldReturnReview() throws Exception {
        Long reviewId = 1L;
        ReviewResponse response = new ReviewResponse();

        when(reviewService.getReviewById(reviewId)).thenReturn(response);

        mockMvc.perform(get("/api/v1/reviews/{reviewId}", reviewId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/v1/reviews/book/{bookId} - Should create review")
    void createReview_ShouldReturnCreated() throws Exception {
        Long bookId = 1L;
        ReviewRequest request = new ReviewRequest();
        ReviewResponse response = new ReviewResponse();

        when(reviewService.createReview(eq(bookId), any(ReviewRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/reviews/book/{bookId}", bookId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("POST /api/v1/reviews/{reviewId}/like - Should like review")
    void likeReview_ShouldReturnLikeCount() throws Exception {
        Long reviewId = 1L;
        when(reviewService.likeReview(reviewId)).thenReturn(5L);

        mockMvc.perform(post("/api/v1/reviews/{reviewId}/like", reviewId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("5"));
    }
}