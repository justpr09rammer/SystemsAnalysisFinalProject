package com.example.systemsanalysisfinalproject.Service;
 
import com.example.systemsanalysisfinalproject.DTOs.FeedItem;
import com.example.systemsanalysisfinalproject.DTOs.UserStatsResponse;
import com.example.systemsanalysisfinalproject.Model.Follow;
import com.example.systemsanalysisfinalproject.Model.*;

import com.example.systemsanalysisfinalproject.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Repository.UserRepository;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
 
@Service
@Transactional
@RequiredArgsConstructor
public class SocialService {
 
    private final FollowRepository followRepository;
    private final ReviewRepository reviewRepository;
    private final ShelfBookRepository shelfBookRepository;
    private final UserRepository userRepository;
    private final UserService userService;
 
    public Follow follow(Long targetUserId) {
        User current = userService.getCurrentUser();
        if (current.getId().equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }
        if (followRepository.existsByFollowerIdAndFollowingId(current.getId(), targetUserId)) {
            throw new IllegalArgumentException("You are already following this user");
        }
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return followRepository.save(Follow.builder().follower(current).following(target).build());
    }
 
    public void unfollow(Long targetUserId) {
        User current = userService.getCurrentUser();
        Follow follow = followRepository.findByFollowerIdAndFollowingId(current.getId(), targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("You are not following this user"));
        followRepository.delete(follow);
    }
 
    @Transactional(readOnly = true)
    public Page<Follow> getFollowers(Long userId, Pageable pageable) {
        return followRepository.findByFollowingId(userId, pageable);
    }
 
    @Transactional(readOnly = true)
    public Page<Follow> getFollowing(Long userId, Pageable pageable) {
        return followRepository.findByFollowerId(userId, pageable);
    }
 
    @Transactional(readOnly = true)
    public boolean isFollowing(Long targetUserId) {
        User current = userService.getCurrentUser();
        return followRepository.existsByFollowerIdAndFollowingId(current.getId(), targetUserId);
    }
 
    @Transactional(readOnly = true)
    public UserStatsResponse getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
 
        List<Shelf> shelves = shelfBookRepository
                .findAll().stream()
                .filter(sb -> sb.getShelf().getUser().getId().equals(userId))
                .map(ShelfBook::getShelf)
                .distinct()
                .collect(Collectors.toList());
 
        long booksRead = shelves.stream()
                .filter(s -> s.getName().equals(ShelfService.READ))
                .mapToLong(s -> s.getShelfBooks().size())
                .sum();
        long reading = shelves.stream()
                .filter(s -> s.getName().equals(ShelfService.CURRENTLY_READING))
                .mapToLong(s -> s.getShelfBooks().size())
                .sum();
        long wantToRead = shelves.stream()
                .filter(s -> s.getName().equals(ShelfService.WANT_TO_READ))
                .mapToLong(s -> s.getShelfBooks().size())
                .sum();
 
        long reviewsCount = reviewRepository.findByUserId(userId, Pageable.unpaged()).getTotalElements();
        long followers = followRepository.countByFollowingId(userId);
        long following = followRepository.countByFollowerId(userId);
 
        return UserStatsResponse.builder()
                .userId(userId)
                .username(user.getUsername())
                .booksRead(booksRead)
                .booksReading(reading)
                .booksWantToRead(wantToRead)
                .reviewsWritten(reviewsCount)
                .followersCount(followers)
                .followingCount(following)
                .build();
    }
 
    @Transactional(readOnly = true)
    public Page<FeedItem> getFeed(Pageable pageable) {
        User current = userService.getCurrentUser();
        Page<Review> reviews = reviewRepository.findFollowingReviews(current.getId(), pageable);
        List<FeedItem> items = reviews.getContent().stream()
                .map(r -> FeedItem.builder()
                        .type(FeedItem.FeedType.REVIEW)
                        .actorId(r.getUser().getId())
                        .actorUsername(r.getUser().getUsername())
                        .bookId(r.getBook().getId())
                        .bookTitle(r.getBook().getTitle())
                        .bookCoverUrl(r.getBook().getCoverImageUrl())
                        .detail(r.getRating() + "/5 stars")
                        .timestamp(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return new PageImpl<>(items, pageable, reviews.getTotalElements());
    }
}
 