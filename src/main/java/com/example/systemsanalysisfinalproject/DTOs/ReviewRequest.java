package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.*;
import lombok.*;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
 
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
 
    @Size(max = 5000, message = "Review body must be under 5000 characters")
    private String body;
}