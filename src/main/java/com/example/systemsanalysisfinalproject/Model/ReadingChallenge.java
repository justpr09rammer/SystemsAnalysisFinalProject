package com.example.systemsanalysisfinalproject.Model;

import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "reading_challenges",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "year"})
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReadingChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "verificationCode", "verificationCodeExpiresAt", "authorities"})
    private User user;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "goal_books", nullable = false)
    private Integer goalBooks;

    @Column(name = "books_read")
    private Integer booksRead;

    public Double getPercentComplete() {
        if (goalBooks == null || goalBooks == 0 || booksRead == null) return 0.0;
        return Math.min(100.0, (booksRead * 100.0) / goalBooks);
    }

    public boolean isCompleted() {
        return booksRead != null && goalBooks != null && booksRead >= goalBooks;
    }
}