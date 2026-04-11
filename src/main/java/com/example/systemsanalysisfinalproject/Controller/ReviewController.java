package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.ReviewRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReviewResponse;
import com.example.systemsanalysisfinalproject.Service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Write and manage book reviews")
public class ReviewController {
 
    private final ReviewService reviewService;
 
    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get all reviews for a book")
    public Page<ReviewResponse> getReviewsForBook(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return reviewService.getReviewsForBook(bookId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
 
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get reviews by a user")
    public Page<ReviewResponse> getReviewsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return reviewService.getReviewsByUser(userId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
 
    @GetMapping("/my-reviews")
    @Operation(summary = "Get current user's reviews")
    public Page<ReviewResponse> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return reviewService.getCurrentUserReviews(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
 
    @GetMapping("/following")
    @Operation(summary = "Get reviews from followed users")
    public Page<ReviewResponse> getFollowingReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return reviewService.getFollowingReviews(PageRequest.of(page, size));
    }
 
    @GetMapping("/{reviewId}")
    @Operation(summary = "Get a single review")
    public ReviewResponse getReviewById(@PathVariable Long reviewId) {
        return reviewService.getReviewById(reviewId);
    }
 
    @PostMapping("/book/{bookId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a review for a book")
    public ReviewResponse createReview(@PathVariable Long bookId, @Valid @RequestBody ReviewRequest request) {
        return reviewService.createReview(bookId, request);
    }
 
    @PutMapping("/{reviewId}")
    @Operation(summary = "Update your review")
    public ReviewResponse updateReview(@PathVariable Long reviewId, @Valid @RequestBody ReviewRequest request) {
        return reviewService.updateReview(reviewId, request);
    }
 
    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a review")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
 
    @PostMapping("/{reviewId}/like")
    @Operation(summary = "Like a review")
    public long likeReview(@PathVariable Long reviewId) {
        return reviewService.likeReview(reviewId);
    }
 
    @DeleteMapping("/{reviewId}/like")
    @Operation(summary = "Unlike a review")
    public long unlikeReview(@PathVariable Long reviewId) {
        return reviewService.unlikeReview(reviewId);
    }
}
 