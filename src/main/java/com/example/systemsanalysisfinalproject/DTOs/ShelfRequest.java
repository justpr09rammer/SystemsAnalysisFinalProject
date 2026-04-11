package com.example.systemsanalysisfinalproject.DTOs;
 
import jakarta.validation.constraints.NotBlank;
import lombok.*;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShelfRequest {
 
    @NotBlank(message = "Shelf name is required")
    private String name;
}