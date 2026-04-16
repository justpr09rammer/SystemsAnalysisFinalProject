// QuizRequest.java
package com.example.systemsanalysisfinalproject.DTOs;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizRequest {

    @NotNull(message = "Book ID is required")
    private Long bookId;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be under 200 characters")
    private String title;

    @Size(max = 1000, message = "Description must be under 1000 characters")
    private String description;

    @NotEmpty(message = "At least one question is required")
    @Valid
    private List<QuestionRequest> questions;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionRequest {
        @NotBlank(message = "Question text is required")
        @Size(max = 1000, message = "Question must be under 1000 characters")
        private String questionText;

        @NotEmpty(message = "At least 2 options are required")
        @Size(min = 2, max = 6, message = "Must have between 2 and 6 options")
        @Valid
        private List<OptionRequest> options;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OptionRequest {
        @NotBlank(message = "Option text is required")
        @Size(max = 500, message = "Option must be under 500 characters")
        private String optionText;

        private boolean correct;
    }
}
