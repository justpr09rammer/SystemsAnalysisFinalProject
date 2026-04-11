package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
 
import java.time.LocalDate;
import java.util.List;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookRequest {
 
    @NotBlank(message = "Title is required")
    private String title;
 
    private String description;
    private String coverImageUrl;
    private String isbn10;
    private String isbn13;
 
    @Positive(message = "Page count must be positive")
    private Integer pageCount;
 
    private LocalDate publishedDate;
    private String language;
    private String openLibraryId;
    private List<Long> authorIds;
    private List<Long> genreIds;
}