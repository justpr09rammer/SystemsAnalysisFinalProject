package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.AuthorRequest;
import com.example.systemsanalysisfinalproject.Model.Author;
import com.example.systemsanalysisfinalproject.Repository.AuthorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.util.NoSuchElementException;
 
@RestController
@RequestMapping("/api/v1/authors")
@RequiredArgsConstructor
@Tag(name = "Authors", description = "Manage book authors")
public class AuthorController {
 
    private final AuthorRepository authorRepository;
 
    @GetMapping
    @Operation(summary = "Get all authors")
    public Page<Author> getAllAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return authorRepository.findAll(PageRequest.of(page, size, Sort.by("name").ascending()));
    }
 
    @GetMapping("/{authorId}")
    @Operation(summary = "Get author by ID")
    public Author getAuthorById(@PathVariable Long authorId) {
        return authorRepository.findById(authorId)
                .orElseThrow(() -> new NoSuchElementException("Author not found"));
    }
 
    @GetMapping("/search")
    @Operation(summary = "Search authors by name")
    public Page<Author> searchAuthors(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return authorRepository.searchByName(q, PageRequest.of(page, size));
    }
 
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create an author (Admin)")
    public Author createAuthor(@Valid @RequestBody AuthorRequest request) {
        Author author = Author.builder()
                .name(request.getName())
                .bio(request.getBio())
                .photoUrl(request.getPhotoUrl())
                .openLibraryId(request.getOpenLibraryId())
                .build();
        return authorRepository.save(author);
    }
 
    @PutMapping("/{authorId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an author (Admin)")
    public Author updateAuthor(@PathVariable Long authorId, @Valid @RequestBody AuthorRequest request) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new NoSuchElementException("Author not found"));
        if (request.getName() != null) author.setName(request.getName());
        if (request.getBio() != null) author.setBio(request.getBio());
        if (request.getPhotoUrl() != null) author.setPhotoUrl(request.getPhotoUrl());
        return authorRepository.save(author);
    }
 
    @DeleteMapping("/{authorId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an author (Admin)")
    public void deleteAuthor(@PathVariable Long authorId) {
        if (!authorRepository.existsById(authorId)) throw new NoSuchElementException("Author not found");
        authorRepository.deleteById(authorId);
    }
}