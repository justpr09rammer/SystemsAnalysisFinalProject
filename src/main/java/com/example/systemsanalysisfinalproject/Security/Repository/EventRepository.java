package com.example.systemsanalysisfinalproject.Security.Repository;

import com.example.systemsanalysisfinalproject.Security.Model.EventType;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Model.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<UserEvent, Long> {

    // Pagination
    Page<UserEvent> findAll(Pageable pageable);

    // Filter by user
    Page<UserEvent> findByUser(User user, Pageable pageable);
    Page<UserEvent> findByUserId(Long userId, Pageable pageable);

    // Filter by event type
    Page<UserEvent> findByEventType(EventType eventType, Pageable pageable);

    // Filter by date range
    Page<UserEvent> findByEventTimeBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Filter by user and event type
    Page<UserEvent> findByUserIdAndEventType(Long userId, EventType eventType, Pageable pageable);

    // Filter by user and date range
    Page<UserEvent> findByUserIdAndEventTimeBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Filter by event type and date range
    Page<UserEvent> findByEventTypeAndEventTimeBetween(EventType eventType, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // Complex filter: user, event type, and date range
    Page<UserEvent> findByUserIdAndEventTypeAndEventTimeBetween(
            Long userId,
            EventType eventType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable
    );

    // Custom query for more complex filtering
    @Query("SELECT e FROM UserEvent e WHERE " +
            "(:userId IS NULL OR e.user.id = :userId) AND " +
            "(:eventType IS NULL OR e.eventType = :eventType) AND " +
            "(:startDate IS NULL OR e.eventTime >= :startDate) AND " +
            "(:endDate IS NULL OR e.eventTime <= :endDate)")
    Page<UserEvent> findByFilters(
            @Param("userId") Long userId,
            @Param("eventType") EventType eventType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    // Get latest events for a user
    List<UserEvent> findTop10ByUserIdOrderByEventTimeDesc(Long userId);
}