package com.example.systemsanalysisfinalproject.Security.Service;


import com.example.systemsanalysisfinalproject.Security.Model.EventType;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.DTOs.Request.UserRegisterRequest;

import com.example.systemsanalysisfinalproject.Security.Model.UserEvent;
import com.example.systemsanalysisfinalproject.Security.Model.UserStatus;
import com.example.systemsanalysisfinalproject.Security.Repository.EventRepository;
import com.example.systemsanalysisfinalproject.Security.Repository.UserRepository;
import com.example.systemsanalysisfinalproject.Security.Utils.LimitProperties;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EventRepository eventRepository;
    private final LimitProperties limitProperties;
    @Transactional(readOnly = true)
    public List<User> getAllUsersList() {
        return userRepository.findAll();
    }

    /**
     * Get all users with pagination
     */
    @Transactional(readOnly = true)
    public Page<User> getAllUsers(Pageable pageable) {
        logger.debug("Fetching all users with pagination");
        return userRepository.findAll(pageable);
    }

    /**
     * Get users by filters (status and search)
     */
    @Transactional(readOnly = true)
    public Page<User> getUsersByFilters(UserStatus status, String search, Pageable pageable) {
        logger.debug("Fetching users with filters - status: {}, search: {}", status, search);
        return userRepository.findByFilters(status, search, pageable);
    }

    /**
     * Search users by username or email
     */
    @Transactional(readOnly = true)
    public Page<User> searchUsers(String search, Pageable pageable) {
        logger.debug("Searching users with query: {}", search);
        return userRepository.searchUsers(search, pageable);
    }

    /**
     * Get users by status
     */
    @Transactional(readOnly = true)
    public Page<User> getUsersByStatus(UserStatus status, Pageable pageable) {
        logger.debug("Fetching users with status: {}", status);
        return userRepository.findByUserStatus(status, pageable);
    }

    /**
     * Get user by ID
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    /**
     * Get user count statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Long> getUserCountStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", userRepository.count());
        stats.put("active", userRepository.countByUserStatus(UserStatus.ACTIVE));
        stats.put("deleted", userRepository.countByUserStatus(UserStatus.DELETED));
        return stats;
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("User not authenticated");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            throw new SecurityException("Invalid principal type");
        }

        return (User) principal;
    }

    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User currentUser = getCurrentUser();

        if (isUserDeleted(currentUser)) {
            throw new IllegalStateException("Cannot change password for deleted user");
        }
        if (currentUser.getPasswordChangeAttempts() == limitProperties.getMaxPasswordChangeAttempts()) {
            throw new IllegalStateException("you have already changed the password");
        }

        if (!passwordEncoder.matches(currentPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Validate new password
        validateNewPassword(newPassword);

        // Check if new password is same as current password
        if (passwordEncoder.matches(newPassword, currentUser.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        // Encode and set new password
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        currentUser.setPassword(encodedNewPassword);
        currentUser.setPasswordChangeAttempts(currentUser.getPasswordChangeAttempts() + 1);
        userRepository.save(currentUser);

        UserEvent event = UserEvent.builder()
                .eventTime(LocalDateTime.now())
                .eventType(EventType.PASSWORD_CHANGED)
                .user(currentUser)
                .build();
        eventRepository.save(event);

        logger.info("Password changed successfully for user: {}", currentUser.getUsername());
    }

    @Transactional
    public void resetPassword(Long userId, String newPassword) {
        User user = getUserById(userId);

        if (isUserDeleted(user)) {
            throw new IllegalStateException("Cannot reset password for deleted user");
        }

        validateNewPassword(newPassword);

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);
        userRepository.save(user);

        logger.info("Password reset successfully for user: {} by admin", user.getUsername());
    }

    @Transactional
    public void deleteCurrentUser() {
        User currentUser = getCurrentUser();

        if (isUserDeleted(currentUser)) {
            throw new IllegalStateException("User already deleted");
        }

        currentUser.setUserStatus(UserStatus.DELETED);
        userRepository.save(currentUser);

        UserEvent event = UserEvent.builder()
                .eventTime(LocalDateTime.now())
                .eventType(EventType.USER_DELETED)
                .user(currentUser)
                .build();
        eventRepository.save(event);

        SecurityContextHolder.clearContext();

        logger.info("User {} has been deleted", currentUser.getUsername());
    }

    @Transactional
    public void deleteUserByAdmin(Long userId) {
        User user = getUserById(userId);

        if (isUserDeleted(user)) {
            throw new IllegalStateException("User already deleted");
        }

        user.setUserStatus(UserStatus.DELETED);
        userRepository.save(user);

        UserEvent event = UserEvent.builder()
                .eventTime(LocalDateTime.now())
                .eventType(EventType.USER_DELETED)
                .user(user)
                .build();
        eventRepository.save(event);

        logger.info("User {} with ID {} has been deleted by admin", user.getUsername(), userId);
    }

    @Transactional(readOnly = true)
    protected boolean isUserDeleted(User user) {
        return user.getUserStatus() == UserStatus.DELETED;
    }

    private void validateNewPassword(String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("new password cannot be empty");
        }

        if (newPassword.length() < 5) {
            throw new IllegalArgumentException("new password should be at least 5 chars");
        }
    }
}