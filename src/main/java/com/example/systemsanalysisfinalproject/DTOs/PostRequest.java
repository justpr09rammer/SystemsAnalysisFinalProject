package com.example.systemsanalysisfinalproject.DTOs;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {

    @NotBlank(message = "Body is required")
    @Size(max = 5000, message = "Body must be under 5000 characters")
    private String body;

    private Long parentPostId; // null for top-level reply
}
