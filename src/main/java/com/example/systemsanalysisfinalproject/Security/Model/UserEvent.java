package com.example.systemsanalysisfinalproject.Security.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_events")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "verificationCode", "verificationCodeExpiresAt", "authorities"})
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "event_time", nullable = false)
    private LocalDateTime eventTime;

    @PrePersist
    protected void onCreate() {
        eventTime = LocalDateTime.now();
    }
}