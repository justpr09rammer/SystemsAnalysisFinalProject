package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.FeedItem;
import com.example.systemsanalysisfinalproject.DTOs.UserStatsResponse;
import com.example.systemsanalysisfinalproject.Model.Follow;
import com.example.systemsanalysisfinalproject.Service.SocialService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class SocialControllerTest {

    private MockMvc mockMvc;
    private SocialService socialService;

    @BeforeEach
    void setUp() {
        socialService = Mockito.mock(SocialService.class);
        SocialController controller = new SocialController(socialService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @DisplayName("POST /api/v1/social/follow/{userId} - Should follow user")
    void followUser_ShouldReturnFollow() throws Exception {
        Long userId = 2L;
        Follow follow = new Follow();

        when(socialService.follow(userId)).thenReturn(follow);

        mockMvc.perform(post("/api/v1/social/follow/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated());
    }

    @Test
    @DisplayName("GET /api/v1/social/stats/{userId} - Should return stats")
    void getUserStats_ShouldReturnStats() throws Exception {
        Long userId = 1L;
        UserStatsResponse stats = new UserStatsResponse();

        when(socialService.getUserStats(userId)).thenReturn(stats);

        mockMvc.perform(get("/api/v1/social/stats/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/v1/social/following/{userId} - Should check if following")
    void isFollowing_ShouldReturnBoolean() throws Exception {
        Long userId = 1L;
        when(socialService.isFollowing(userId)).thenReturn(true);

        mockMvc.perform(get("/api/v1/social/following/{userId}", userId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}