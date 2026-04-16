package com.example.systemsanalysisfinalproject.DTOs;

import com.example.systemsanalysisfinalproject.Model.Discussion;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiscussionResponse {
    private Long id;
    private Long authorId;
    private String authorUsername;
    private Long bookId;
    private String bookTitle;
    private String bookCoverUrl;
    private String title;
    private String body;
    private Discussion.TopicType topicType;
    private String topicLabel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean pinned;
    private boolean closed;
    private int viewsCount;
    private int postCount;
    private int voteScore;
    private Integer userVote; // +1, -1, or null
    private List<PostResponse> posts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class PostResponse {
        private Long id;
        private Long authorId;
        private String authorUsername;
        private String body;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private boolean acceptedAnswer;
        private int voteScore;
        private Integer userVote;
        private Long parentPostId;
        private List<PostResponse> replies;
    }
}
