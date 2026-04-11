package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.NotBlank;
import lombok.*;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthorRequest {
 
    @NotBlank(message = "Author name is required")
    private String name;
 
    private String bio;
    private String photoUrl;
    private String openLibraryId;
}