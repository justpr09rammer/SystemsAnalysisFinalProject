package com.example.systemsanalysisfinalproject.DTOs;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizSubmitRequest {
    @NotNull(message = "Answers map is required")
    // key = questionId, value = selected optionId
    private Map<Long, Long> answers;
}

// ---- nested AttemptResponse in same package file ----
