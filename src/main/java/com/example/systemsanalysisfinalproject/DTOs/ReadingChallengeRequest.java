package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.*;
import lombok.*;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReadingChallengeRequest {
 
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    private Integer year;
 
    @NotNull(message = "Goal is required")
    @Positive(message = "Goal must be a positive number")
    private Integer goalBooks;
}
 