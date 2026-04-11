package com.example.systemsanalysisfinalproject.DTOs;
 
import lombok.*;
import java.time.LocalDateTime;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long bookId;
    private String bookTitle;
    private Integer rating;
    private String body;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likesCount;
    private boolean likedByCurrentUser;
}