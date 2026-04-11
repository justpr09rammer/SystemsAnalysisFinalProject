package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.FeedItem;
import com.example.systemsanalysisfinalproject.DTOs.UserStatsResponse;
import com.example.systemsanalysisfinalproject.Model.Follow;
import com.example.systemsanalysisfinalproject.Service.SocialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
 
@RestController
@RequestMapping("/api/v1/social")
@RequiredArgsConstructor
@Tag(name = "Social", description = "Follow users and get the activity feed")
public class SocialController {
 
    private final SocialService socialService;
 
    @PostMapping("/follow/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Follow a user")
    public Follow followUser(@PathVariable Long userId) {
        return socialService.follow(userId);
    }
 
    @DeleteMapping("/follow/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Unfollow a user")
    public void unfollowUser(@PathVariable Long userId) {
        socialService.unfollow(userId);
    }
 
    @GetMapping("/following/{userId}")
    @Operation(summary = "Check if current user follows given user")
    public boolean isFollowing(@PathVariable Long userId) {
        return socialService.isFollowing(userId);
    }
 
    @GetMapping("/followers/{userId}")
    @Operation(summary = "Get followers of a user")
    public Page<Follow> getFollowers(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return socialService.getFollowers(userId, PageRequest.of(page, size));
    }
 
    @GetMapping("/following-list/{userId}")
    @Operation(summary = "Get users followed by a user")
    public Page<Follow> getFollowingList(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return socialService.getFollowing(userId, PageRequest.of(page, size));
    }
 
    @GetMapping("/stats/{userId}")
    @Operation(summary = "Get reading stats for a user")
    public UserStatsResponse getUserStats(@PathVariable Long userId) {
        return socialService.getUserStats(userId);
    }
 
    @GetMapping("/feed")
    @Operation(summary = "Get activity feed from followed users")
    public Page<FeedItem> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return socialService.getFeed(PageRequest.of(page, size));
    }
}