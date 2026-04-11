package com.example.systemsanalysisfinalproject.DTOs;
 
import lombok.*;
import java.time.LocalDateTime;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FeedItem {
    public enum FeedType { REVIEW, SHELF_ADD, PROGRESS_UPDATE, CHALLENGE_UPDATE }
    private FeedType type;
    private Long actorId;
    private String actorUsername;
    private Long bookId;
    private String bookTitle;
    private String bookCoverUrl;
    private String detail;
    private LocalDateTime timestamp;
}
 
 