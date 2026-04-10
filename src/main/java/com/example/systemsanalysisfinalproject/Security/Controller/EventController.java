package com.example.systemsanalysisfinalproject.Security.Controller;


import com.example.systemsanalysisfinalproject.Security.Model.EventType;
import com.example.systemsanalysisfinalproject.Security.Model.UserEvent;
import com.example.systemsanalysisfinalproject.Security.Service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Tag(name = "Event Management", description = "APIs for managing user events and audit logs")
public class EventController {

    private final EventService eventService;

    @Operation(summary = "Get events for current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved current user events"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/my-events")
    public Page<UserEvent> getCurrentUserEvents(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field and direction", example = "eventTime,desc")
            @RequestParam(defaultValue = "eventTime,desc", required = false) String[] sort) {

        return eventService.getCurrentUserEvents(
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by(parseSort(sort))));
    }

    @Operation(summary = "Get latest events for current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved latest events"),
            @ApiResponse(responseCode = "401", description = "User not authenticated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/my-events/latest")
    public List<UserEvent> getLatestEvents() {
        return eventService.getLatestEventsForCurrentUser();
    }

    // ==================== ADMIN ENDPOINTS ====================

    @Operation(summary = "Get all events with pagination and filtering (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of events"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserEvent> getAllEvents(
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field and direction", example = "eventTime,desc")
            @RequestParam(defaultValue = "eventTime,desc", required = false) String[] sort,
            @Parameter(description = "Filter by user ID")
            @RequestParam(required = false) Long userId,
            @Parameter(description = "Filter by event type")
            @RequestParam(required = false) EventType eventType,
            @Parameter(description = "Filter by start date (ISO format)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "Filter by end date (ISO format)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        org.springframework.data.domain.Pageable pageable =
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by(parseSort(sort)));

        if (userId != null || eventType != null || startDate != null || endDate != null) {
            return eventService.getEventsByFilters(userId, eventType, startDate, endDate, pageable);
        }
        return eventService.getAllEvents(pageable);
    }

    @Operation(summary = "Get events by user ID (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved events for the user"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserEvent> getEventsByUserId(
            @Parameter(description = "ID of the user", required = true, example = "1")
            @PathVariable Long userId,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field and direction", example = "eventTime,desc")
            @RequestParam(defaultValue = "eventTime,desc", required = false) String[] sort) {

        return eventService.getEventsByUserId(userId,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by(parseSort(sort))));
    }

    @Operation(summary = "Get events by type (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved events by type"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/type/{eventType}")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserEvent> getEventsByType(
            @Parameter(description = "Type of event to filter by", required = true)
            @PathVariable EventType eventType,
            @Parameter(description = "Page number (0-indexed)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int page,
            @Parameter(description = "Number of items per page", example = "10")
            @RequestParam(defaultValue = "10", required = false) int size,
            @Parameter(description = "Sort field and direction", example = "eventTime,desc")
            @RequestParam(defaultValue = "eventTime,desc", required = false) String[] sort) {

        return eventService.getEventsByType(eventType,
                org.springframework.data.domain.PageRequest.of(page, size,
                        org.springframework.data.domain.Sort.by(parseSort(sort))));
    }

    @Operation(summary = "Get event by ID (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved event"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserEvent getEventById(
            @Parameter(description = "ID of the event to retrieve", required = true, example = "1")
            @PathVariable Long eventId) {
        return eventService.getEventById(eventId);
    }
//
//    @Operation(summary = "Delete event by ID (Admin)")
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
//            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
//            @ApiResponse(responseCode = "404", description = "Event not found"),
//            @ApiResponse(responseCode = "500", description = "Internal server error")
//    })
//    @DeleteMapping("/{eventId}")
//    @PreAuthorize("hasRole('ADMIN')")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void deleteEvent(
//            @Parameter(description = "ID of the event to delete", required = true, example = "1")
//            @PathVariable Long eventId) {
//        eventService.deleteEvent(eventId);
//    }

    @Operation(summary = "Get event count by user (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved event count"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Long countEventsByUserId(
            @Parameter(description = "ID of the user", required = true, example = "1")
            @PathVariable Long userId) {
        return eventService.countEventsByUserId(userId);
    }

    @Operation(summary = "Get event count by type (Admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved event count"),
            @ApiResponse(responseCode = "403", description = "Access denied - ADMIN role required"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/count/type/{eventType}")
    @PreAuthorize("hasRole('ADMIN')")
    public Long countEventsByType(
            @Parameter(description = "Type of event", required = true)
            @PathVariable EventType eventType) {
        return eventService.countEventsByType(eventType);
    }

    private org.springframework.data.domain.Sort.Order[] parseSort(String[] sort) {
        return new org.springframework.data.domain.Sort.Order[]{
                sort.length > 1 && sort[1].equalsIgnoreCase("asc")
                        ? org.springframework.data.domain.Sort.Order.asc(sort[0])
                        : org.springframework.data.domain.Sort.Order.desc(sort[0])
        };
    }
}