package com.example.systemsanalysisfinalproject.DTOs;
 
import com.example.systemsanalysisfinalproject.Model.Author;
import com.example.systemsanalysisfinalproject.Model.Genre;
import lombok.*;
 
import java.time.LocalDate;
import java.util.List;
 
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String description;
    private String coverImageUrl;
    private String isbn10;
    private String isbn13;
    private Integer pageCount;
    private LocalDate publishedDate;
    private String language;
    private Double averageRating;
    private Integer ratingsCount;
    private List<Author> authors;
    private List<Genre> genres;

    private List<String> userShelves;
    private Integer userRating;
    private Double userReadingPercent;
}
 