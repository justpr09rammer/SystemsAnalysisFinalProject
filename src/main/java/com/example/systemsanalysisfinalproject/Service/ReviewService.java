package com.example.systemsanalysisfinalproject.Service;
 
import com.example.systemsanalysisfinalproject.DTOs.ReviewRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReviewResponse;
import com.example.systemsanalysisfinalproject.Model.Review;
import com.example.systemsanalysisfinalproject.Repository.ReviewLikeRepository;
import com.example.systemsanalysisfinalproject.Repository.ReviewRepository;
import com.example.systemsanalysisfinalproject.Security.Model.*;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Security.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.NoSuchElementException;
 
@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
 
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
 
    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final BookService bookService;
    private final UserService userService;
 

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsForBook(Long bookId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByBookId(bookId, pageable);
        return reviews.map(this::toResponse);
    }
 
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviewsByUser(Long userId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
        return reviews.map(this::toResponse);
    }
 
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getCurrentUserReviews(Pageable pageable) {
        User current = userService.getCurrentUser();
        return getReviewsByUser(current.getId(), pageable);
    }
 
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getFollowingReviews(Pageable pageable) {
        User current = userService.getCurrentUser();
        Page<Review> reviews = reviewRepository.findFollowingReviews(current.getId(), pageable);
        return reviews.map(this::toResponse);
    }
 
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        return toResponse(findReviewOrThrow(reviewId));
    }
 

    public ReviewResponse createReview(Long bookId, ReviewRequest request) {
        User current = userService.getCurrentUser();
 
        if (reviewRepository.existsByUserIdAndBookId(current.getId(), bookId)) {
            throw new IllegalArgumentException("You have already reviewed this book. Use update instead.");
        }
 
        Book book = bookService.findBookOrThrow(bookId);
        Review review = Review.builder()
                .user(current)
                .book(book)
                .rating(request.getRating())
                .body(request.getBody())
                .build();
        Review saved = reviewRepository.save(review);
        bookService.recalculateRating(bookId);
        logger.info("User {} reviewed book '{}'", current.getUsername(), book.getTitle());
        return toResponse(saved);
    }
 
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request) {
        Review review = findReviewOrThrow(reviewId);
        User current = userService.getCurrentUser();
        assertOwnership(review, current);
 
        review.setRating(request.getRating());
        if (request.getBody() != null) review.setBody(request.getBody());
        Review saved = reviewRepository.save(review);
        bookService.recalculateRating(review.getBook().getId());
        return toResponse(saved);
    }
 
    public void deleteReview(Long reviewId) {
        Review review = findReviewOrThrow(reviewId);
        User current = userService.getCurrentUser();
 
        boolean isAdmin = current.getUserRole() == UserRole.ADMIN;
        if (!isAdmin) assertOwnership(review, current);
 
        Long bookId = review.getBook().getId();
        reviewRepository.delete(review);
        bookService.recalculateRating(bookId);
        logger.info("User {} deleted review {}", current.getUsername(), reviewId);
    }
 

    // like operations
    public long likeReview(Long reviewId) {
        User current = userService.getCurrentUser();
        findReviewOrThrow(reviewId);
 
        if (reviewLikeRepository.existsByUserIdAndReviewId(current.getId(), reviewId)) {
            throw new IllegalArgumentException("You already liked this review");
        }
 
        Review review = findReviewOrThrow(reviewId);
        reviewLikeRepository.save(ReviewLike.builder().user(current).review(review).build());
        return reviewLikeRepository.countByReviewId(reviewId);
    }
 
    public long unlikeReview(Long reviewId) {
        User current = userService.getCurrentUser();
        ReviewLike like = reviewLikeRepository.findByUserIdAndReviewId(current.getId(), reviewId)
                .orElseThrow(() -> new IllegalArgumentException("You have not liked this review"));
        reviewLikeRepository.delete(like);
        return reviewLikeRepository.countByReviewId(reviewId);
    }
 
    // helper methods
 
    private ReviewResponse toResponse(Review review) {
        long likesCount = reviewLikeRepository.countByReviewId(review.getId());
        boolean liked = false;
        try {
            User current = userService.getCurrentUser();
            liked = reviewLikeRepository.existsByUserIdAndReviewId(current.getId(), review.getId());
        } catch (Exception ignored) {}
 
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .username(review.getUser().getUsername())
                .bookId(review.getBook().getId())
                .bookTitle(review.getBook().getTitle())
                .rating(review.getRating())
                .body(review.getBody())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .likesCount(likesCount)
                .likedByCurrentUser(liked)
                .build();
    }
 
    private Review findReviewOrThrow(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NoSuchElementException("Review not found with id: " + reviewId));
    }
 
    private void assertOwnership(Review review, User user) {
        if (!review.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not own this review");
        }
    }
}
 