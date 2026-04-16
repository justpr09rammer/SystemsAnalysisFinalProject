package com.example.systemsanalysisfinalproject.DTOs;

import com.example.systemsanalysisfinalproject.Model.Discussion;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscussionRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 300, message = "Title must be under 300 characters")
    private String title;

    @NotBlank(message = "Body is required")
    @Size(max = 5000, message = "Body must be under 5000 characters")
    private String body;

    private Discussion.TopicType topicType = Discussion.TopicType.GENERAL;

    private String topicLabel;

    private Long bookId;
}
