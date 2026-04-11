package com.example.systemsanalysisfinalproject.Model;

import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "shelves",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "name"})
)
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Shelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_default")
    private boolean isDefault;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "verificationCode", "verificationCodeExpiresAt", "authorities"})
    private User user;

    @OneToMany(mappedBy = "shelf", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"shelf"})
    @Builder.Default
    private List<ShelfBook> shelfBooks = new ArrayList<>();
}