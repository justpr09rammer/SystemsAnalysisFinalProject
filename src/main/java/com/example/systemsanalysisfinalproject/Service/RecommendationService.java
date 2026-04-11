package com.example.systemsanalysisfinalproject.Service;
 
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.*;
import java.util.stream.Collectors;
import com.example.systemsanalysisfinalproject.DTOs.ReadingProgressRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReadingChallengeRequest;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Security.Model.*;

import com.example.systemsanalysisfinalproject.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecommendationService {
 
    private final BookRepository bookRepository;
    private final ShelfBookRepository shelfBookRepository;
    private final ShelfRepository shelfRepository;
    private final ReviewRepository reviewRepository;
    private final UserService userService;
 
    /**
     * Returns books the user hasn't shelved yet, ranked by:
     * 1. Matching genres from their high-rated books
     * 2. Matching authors from their shelves
     * 3. Overall rating
     */
    @Transactional(readOnly = true)
    public List<Book> getRecommendations(int limit) {
        User current = userService.getCurrentUser();
        Set<Long> alreadyShelvedBookIds = getAlreadyShelvedBookIds(current.getId());
 
        // Collect genres from top-rated books
        Set<Long> preferredGenreIds = getPreferredGenreIds(current.getId());
 
        // Collect preferred author ids from shelved books
        Set<Long> preferredAuthorIds = getPreferredAuthorIds(current.getId());
 
        List<Book> allBooks = bookRepository.findTopRated(Pageable.ofSize(200)).getContent();
 
        Map<Book, Integer> scores = new LinkedHashMap<>();
        for (Book book : allBooks) {
            if (alreadyShelvedBookIds.contains(book.getId())) continue;
 
            int score = 0;
            for (Genre g : book.getGenres()) {
                if (preferredGenreIds.contains(g.getId())) score += 2;
            }
            for (Author a : book.getAuthors()) {
                if (preferredAuthorIds.contains(a.getId())) score += 3;
            }
            if (book.getAverageRating() != null) score += (int)(book.getAverageRating() * 10);
            scores.put(book, score);
        }
 
        return scores.entrySet().stream()
                .sorted(Map.Entry.<Book, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
 
    @Transactional(readOnly = true)
    public List<Book> getSimilarBooks(Long bookId, int limit) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found"));
 
        Set<Long> genreIds = book.getGenres().stream().map(Genre::getId).collect(Collectors.toSet());
        Set<Long> authorIds = book.getAuthors().stream().map(Author::getId).collect(Collectors.toSet());
 
        List<Book> allBooks = bookRepository.findTopRated(Pageable.ofSize(200)).getContent();
        return allBooks.stream()
                .filter(b -> !b.getId().equals(bookId))
                .filter(b -> {
                    Set<Long> bGenres = b.getGenres().stream().map(Genre::getId).collect(Collectors.toSet());
                    Set<Long> bAuthors = b.getAuthors().stream().map(Author::getId).collect(Collectors.toSet());
                    bGenres.retainAll(genreIds);
                    bAuthors.retainAll(authorIds);
                    return !bGenres.isEmpty() || !bAuthors.isEmpty();
                })
                .sorted(Comparator.comparingDouble((Book b) -> b.getAverageRating() != null ? b.getAverageRating() : 0).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
 
    private Set<Long> getAlreadyShelvedBookIds(Long userId) {
        List<Shelf> shelves = shelfRepository.findByUserId(userId);
        return shelves.stream()
                .flatMap(s -> shelfBookRepository.findByShelfId(s.getId()).stream())
                .map(sb -> sb.getBook().getId())
                .collect(Collectors.toSet());
    }
 
    private Set<Long> getPreferredGenreIds(Long userId) {
        // Genres from books the user rated 4+
        return reviewRepository.findByUserId(userId, Pageable.unpaged()).getContent().stream()
                .filter(r -> r.getRating() >= 4)
                .flatMap(r -> r.getBook().getGenres().stream())
                .map(Genre::getId)
                .collect(Collectors.toSet());
    }
 
    private Set<Long> getPreferredAuthorIds(Long userId) {
        List<Shelf> shelves = shelfRepository.findByUserId(userId);
        return shelves.stream()
                .flatMap(s -> shelfBookRepository.findByShelfId(s.getId()).stream())
                .flatMap(sb -> sb.getBook().getAuthors().stream())
                .map(Author::getId)
                .collect(Collectors.toSet());
    }
}