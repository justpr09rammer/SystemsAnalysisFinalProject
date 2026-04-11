package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.NotBlank;
import lombok.*;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenreRequest {
 
    @NotBlank(message = "Genre name is required")
    private String name;
 
    private String description;
}
 