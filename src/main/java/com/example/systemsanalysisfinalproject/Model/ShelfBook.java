package com.example.systemsanalysisfinalproject.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "shelf_books",
        uniqueConstraints = @UniqueConstraint(columnNames = {"shelf_id", "book_id"})
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShelfBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelf_id", nullable = false)
    @JsonIgnoreProperties({"shelfBooks", "user"})
    private Shelf shelf;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnoreProperties({"genres"})
    private Book book;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }
}