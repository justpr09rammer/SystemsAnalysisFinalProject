package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.GenreRequest;
import com.example.systemsanalysisfinalproject.Model.Genre;
import com.example.systemsanalysisfinalproject.Repository.GenreRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
import java.util.NoSuchElementException;
 
@RestController
@RequestMapping("/api/v1/genres")
@RequiredArgsConstructor
@Tag(name = "Genres", description = "Manage book genres")
public class GenreController {
 
    private final GenreRepository genreRepository;
 
    @GetMapping
    @Operation(summary = "Get all genres")
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
 
    @GetMapping("/{genreId}")
    @Operation(summary = "Get genre by ID")
    public Genre getGenreById(@PathVariable Long genreId) {
        return genreRepository.findById(genreId)
                .orElseThrow(() -> new NoSuchElementException("Genre not found"));
    }
 
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a genre (Admin)")
    public Genre createGenre(@Valid @RequestBody GenreRequest request) {
        if (genreRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Genre already exists: " + request.getName());
        }
        return genreRepository.save(Genre.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build());
    }
 
    @PutMapping("/{genreId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a genre (Admin)")
    public Genre updateGenre(@PathVariable Long genreId, @Valid @RequestBody GenreRequest request) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new NoSuchElementException("Genre not found"));
        genre.setName(request.getName());
        if (request.getDescription() != null) genre.setDescription(request.getDescription());
        return genreRepository.save(genre);
    }
 
    @DeleteMapping("/{genreId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a genre (Admin)")
    public void deleteGenre(@PathVariable Long genreId) {
        if (!genreRepository.existsById(genreId)) throw new NoSuchElementException("Genre not found");
        genreRepository.deleteById(genreId);
    }
}
 