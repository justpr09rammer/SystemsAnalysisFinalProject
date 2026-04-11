package com.example.systemsanalysisfinalproject.Model;

import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "review_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "review_id"})
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "verificationCode", "verificationCodeExpiresAt", "authorities"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @JsonIgnoreProperties({"likes"})
    private Review review;

    @Column(name = "liked_at", nullable = false)
    private LocalDateTime likedAt;

    @PrePersist
    protected void onCreate() {
        likedAt = LocalDateTime.now();
    }
}