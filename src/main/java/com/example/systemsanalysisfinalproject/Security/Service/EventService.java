package com.example.systemsanalysisfinalproject.Security.Service;


import com.example.systemsanalysisfinalproject.Security.Model.EventType;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Model.UserEvent;
import com.example.systemsanalysisfinalproject.Security.Repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EventService {
    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    private final EventRepository eventRepository;
    private final UserService userService;


    @Transactional(readOnly = true)
    public Page<UserEvent> getAllEvents(Pageable pageable) {
        logger.debug("Fetching all events with pagination: {}", pageable);
        return eventRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<UserEvent> getCurrentUserEvents(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        logger.debug("Fetching events for user: {}", currentUser.getUsername());
        return eventRepository.findByUserId(currentUser.getId(), pageable);
    }


    @Transactional(readOnly = true)
    public Page<UserEvent> getEventsByUserId(Long userId, Pageable pageable) {
        logger.debug("Fetching events for user ID: {}", userId);
        return eventRepository.findByUserId(userId, pageable);
    }

    /**
     * Get events by event type
     */
    @Transactional(readOnly = true)
    public Page<UserEvent> getEventsByType(EventType eventType, Pageable pageable) {
        logger.debug("Fetching events by type: {}", eventType);
        return eventRepository.findByEventType(eventType, pageable);
    }

    @Transactional(readOnly = true)
    public Page<UserEvent> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        logger.debug("Fetching events between {} and {}", startDate, endDate);
        return eventRepository.findByEventTimeBetween(startDate, endDate, pageable);
    }

    @Transactional(readOnly = true)
    public Page<UserEvent> getEventsByFilters(
            Long userId,
            EventType eventType,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {
        
        logger.debug("Fetching events with filters - userId: {}, eventType: {}, startDate: {}, endDate: {}", 
                     userId, eventType, startDate, endDate);
        
        return eventRepository.findByFilters(userId, eventType, startDate, endDate, pageable);
    }

    @Transactional(readOnly = true)
    public List<UserEvent> getLatestEventsForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        logger.debug("Fetching latest events for user: {}", currentUser.getUsername());
        return eventRepository.findTop10ByUserIdOrderByEventTimeDesc(currentUser.getId());
    }


    public UserEvent createEvent(EventType eventType, User user) {
        UserEvent event = UserEvent.builder()
                .eventTime(LocalDateTime.now())
                .eventType(eventType)
                .user(user)
                .build();
        
        UserEvent savedEvent = eventRepository.save(event);
        logger.info("Event created - Type: {}, User: {}", eventType, user.getUsername());
        return savedEvent;
    }


    public UserEvent createEventForCurrentUser(EventType eventType) {
        User currentUser = userService.getCurrentUser();
        return createEvent(eventType, currentUser);
    }


    @Transactional(readOnly = true)
    public UserEvent getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + eventId));
    }

    @Transactional(readOnly = true)
    public long countEventsByUserId(Long userId) {
        return eventRepository.findByUserId(userId, Pageable.unpaged()).getTotalElements();
    }

    @Transactional(readOnly = true)
    public long countEventsByType(EventType eventType) {
        return eventRepository.findByEventType(eventType, Pageable.unpaged()).getTotalElements();
    }
}