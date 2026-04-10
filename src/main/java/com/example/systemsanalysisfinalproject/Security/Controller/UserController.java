package com.example.systemsanalysisfinalproject.Security.Controller;

import com.example.systemsanalysisfinalproject.Security.DTOs.Request.PasswordRequest;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Model.UserStatus;
import com.example.systemsanalysisfinalproject.Security.DTOs.Request.UserRegisterRequest;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get current user profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/my-profile")
    public User getAuthenticatedUser() {
        return userService.getCurrentUser();
    }

    @Operation(summary = "Change current user password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid password request"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PatchMapping("/my-profile/password")
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(@Valid @RequestBody PasswordRequest passwordRequest) {
        userService.changePassword(
                passwordRequest.getCurrentPassword(),
                passwordRequest.getNewPassword()
        );
    }

    @Operation(summary = "Delete current user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User account deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/my-profile")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCurrentUser() {
        userService.deleteCurrentUser();
    }

    // ==================== ADMIN ENDPOINTS ====================

    @Operation(summary = "Get all users with pagination and filtering (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<User> getAllUsers(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field and direction", example = "id,asc")
            @RequestParam(defaultValue = "id,asc", required = false) String[] sort,
            @Parameter(description = "Filter by user status")
            @RequestParam(required = false) UserStatus status,
            @Parameter(description = "Search query for username or email")
            @RequestParam(required = false) String search) {

        if (status != null || search != null) {
            return userService.getUsersByFilters(status, search,
                    org.springframework.data.domain.PageRequest.of(page, size,
                            org.springframework.data.domain.Sort.by(parseSort(sort))));
        }
        return userService.getAllUsers(
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by(parseSort(sort))));
    }

    @Operation(summary = "Get all users without pagination (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsersList() {
        return userService.getAllUsersList();
    }

    @Operation(summary = "Get user by ID (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public User getUserById(
            @Parameter(description = "ID of the user to retrieve", required = true, example = "1")
            @PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @Operation(summary = "Search users (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved search results"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<User> searchUsers(
            @Parameter(description = "Search query", required = true, example = "john")
            @RequestParam String query,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size) {

        return userService.searchUsers(query,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("username").ascending()));
    }

    @Operation(summary = "Get users by status (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved users by status"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<User> getUsersByStatus(
            @Parameter(description = "User status to filter by", required = true)
            @PathVariable UserStatus status,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size) {

        return userService.getUsersByStatus(status,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by("username").ascending()));
    }

    @Operation(summary = "Get user count statistics (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Long> getUserCountStats() {
        return userService.getUserCountStats();
    }

    @Operation(summary = "Reset user password (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PatchMapping("/{userId}/password")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(
            @Parameter(description = "ID of the user", required = true, example = "1")
            @PathVariable Long userId,
            @RequestBody Map<String, String> passwordRequest) {
        userService.resetPassword(userId, passwordRequest.get("newPassword"));
    }

    @Operation(summary = "Delete user (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUser(
            @Parameter(description = "ID of the user to delete", required = true, example = "1")
            @PathVariable Long userId) {
        userService.deleteUserByAdmin(userId);
    }

    private org.springframework.data.domain.Sort.Order[] parseSort(String[] sort) {
        return new org.springframework.data.domain.Sort.Order[]{
                sort.length > 1 && sort[1].equalsIgnoreCase("asc")
                        ? org.springframework.data.domain.Sort.Order.asc(sort[0])
                        : org.springframework.data.domain.Sort.Order.desc(sort[0])
        };
    }
}