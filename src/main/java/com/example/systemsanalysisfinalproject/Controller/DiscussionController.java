package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.DiscussionRequest;
import com.example.systemsanalysisfinalproject.DTOs.DiscussionResponse;
import com.example.systemsanalysisfinalproject.DTOs.PostRequest;
import com.example.systemsanalysisfinalproject.Model.Discussion;
import com.example.systemsanalysisfinalproject.Service.DiscussionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/discussions")
@RequiredArgsConstructor
@Tag(name = "Discussions", description = "Forum-style discussion threads and replies")
public class DiscussionController {

    private final DiscussionService discussionService;

    // ---- Thread listing ----

    @GetMapping
    @Operation(summary = "Get all discussions (paginated)")
    public Page<DiscussionResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String dir) {
        Sort sort = dir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return discussionService.getAll(PageRequest.of(page, size, sort));
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get discussions for a specific book")
    public Page<DiscussionResponse> getByBook(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return discussionService.getByBook(bookId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/topic/{topicType}")
    @Operation(summary = "Get discussions by topic type (BOOK, AUTHOR, GENERAL)")
    public Page<DiscussionResponse> getByTopicType(
            @PathVariable Discussion.TopicType topicType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return discussionService.getByTopicType(topicType, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/search")
    @Operation(summary = "Search discussions by title or body")
    public Page<DiscussionResponse> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return discussionService.search(q, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/{discussionId}")
    @Operation(summary = "Get a discussion with all its posts (increments view count)")
    public DiscussionResponse getById(@PathVariable Long discussionId) {
        return discussionService.getById(discussionId);
    }

    // ---- Thread CRUD ----

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new discussion thread")
    public DiscussionResponse createDiscussion(@Valid @RequestBody DiscussionRequest request) {
        return discussionService.createDiscussion(request);
    }

    @PutMapping("/{discussionId}")
    @Operation(summary = "Update your discussion thread")
    public DiscussionResponse updateDiscussion(
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionRequest request) {
        return discussionService.updateDiscussion(discussionId, request);
    }

    @DeleteMapping("/{discussionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a discussion (owner or admin)")
    public void deleteDiscussion(@PathVariable Long discussionId) {
        discussionService.deleteDiscussion(discussionId);
    }

    // ---- Moderation ----

    @PostMapping("/{discussionId}/pin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle pin status (admin only)")
    public DiscussionResponse togglePin(@PathVariable Long discussionId) {
        return discussionService.togglePin(discussionId);
    }

    @PostMapping("/{discussionId}/close")
    @Operation(summary = "Toggle close status (owner or admin)")
    public DiscussionResponse toggleClose(@PathVariable Long discussionId) {
        return discussionService.toggleClose(discussionId);
    }

    // ---- Posts (replies) ----

    @PostMapping("/{discussionId}/posts")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Post a reply to a discussion")
    public DiscussionResponse.PostResponse createPost(
            @PathVariable Long discussionId,
            @Valid @RequestBody PostRequest request) {
        return discussionService.createPost(discussionId, request);
    }

    @PutMapping("/posts/{postId}")
    @Operation(summary = "Update your reply")
    public DiscussionResponse.PostResponse updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody PostRequest request) {
        return discussionService.updatePost(postId, request);
    }

    @DeleteMapping("/posts/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a reply (owner or admin)")
    public void deletePost(@PathVariable Long postId) {
        discussionService.deletePost(postId);
    }

    @PostMapping("/{discussionId}/posts/{postId}/accept")
    @Operation(summary = "Mark a reply as the accepted answer (thread owner only)")
    public DiscussionResponse.PostResponse markAccepted(
            @PathVariable Long discussionId,
            @PathVariable Long postId) {
        return discussionService.markAcceptedAnswer(discussionId, postId);
    }

    // ---- Voting ----

    @PostMapping("/{discussionId}/vote")
    @Operation(summary = "Upvote (+1) or downvote (-1) a discussion")
    public int voteDiscussion(
            @PathVariable Long discussionId,
            @RequestParam int value) {
        return discussionService.voteDiscussion(discussionId, value);
    }

    @PostMapping("/posts/{postId}/vote")
    @Operation(summary = "Upvote (+1) or downvote (-1) a post")
    public int votePost(
            @PathVariable Long postId,
            @RequestParam int value) {
        return discussionService.votePost(postId, value);
    }
}
