package com.example.systemsanalysisfinalproject.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authors")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Author {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(nullable = false)
    private String name;
 
    @Column(length = 2000)
    private String bio;
 
    @Column(name = "photo_url")
    private String photoUrl;
 
    @Column(name = "open_library_id", unique = true)
    private String openLibraryId;
 
    @ManyToMany(mappedBy = "authors", fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"authors", "genres"})
    @Builder.Default
    private List<Book> books = new ArrayList<>();
}
 