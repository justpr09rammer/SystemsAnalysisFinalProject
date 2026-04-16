package com.example.systemsanalysisfinalproject.DTOs;

import com.example.systemsanalysisfinalproject.Model.Quiz;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuizResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookCoverUrl;
    private Long creatorId;
    private String creatorUsername;
    private String title;
    private String description;
    private Quiz.QuizType quizType;
    private boolean published;
    private LocalDateTime createdAt;
    private int questionCount;
    private int attemptCount;
    private List<QuestionResponse> questions;

    // User-specific data
    private Integer userBestScore;
    private Integer userAttemptCount;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class QuestionResponse {
        private Long id;
        private String questionText;
        private Integer questionOrder;
        private List<OptionResponse> options;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class OptionResponse {
        private Long id;
        private String optionText;
        private boolean correct; // only exposed when quiz is being reviewed after submission
        private Integer optionOrder;
    }
}
