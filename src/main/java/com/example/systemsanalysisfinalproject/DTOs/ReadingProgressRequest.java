package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
 
import java.time.LocalDate;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReadingProgressRequest {
 
    @PositiveOrZero(message = "Current page cannot be negative")
    private Integer currentPage;
 
    private LocalDate startDate;
    private LocalDate finishDate;
}
 