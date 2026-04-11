package com.example.systemsanalysisfinalproject.DTOs;
 
import lombok.*;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserStatsResponse {
    private Long userId;
    private String username;
    private long booksRead;
    private long booksReading;
    private long booksWantToRead;
    private long reviewsWritten;
    private long followersCount;
    private long followingCount;
    private Double averageRatingGiven;
}