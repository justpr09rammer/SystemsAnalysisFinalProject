package com.example.systemsanalysisfinalproject.Service;

import com.example.systemsanalysisfinalproject.DTOs.ShelfRequest;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Security.Model.User;

import com.example.systemsanalysisfinalproject.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class ShelfService {

    private static final Logger logger = LoggerFactory.getLogger(ShelfService.class);

    private final ShelfRepository shelfRepository;
    private final ShelfBookRepository shelfBookRepository;
    private final BookRepository bookRepository;
    private final UserService userService;

    public static final String WANT_TO_READ = "Want to read";
    public static final String CURRENTLY_READING = "Currently reading";
    public static final String READ = "Read";

    // ---- Initialize default shelves for new user ----

    public void createDefaultShelves(User user) {
        createShelf(user, WANT_TO_READ, true);
        createShelf(user, CURRENTLY_READING, true);
        createShelf(user, READ, true);
    }

    private Shelf createShelf(User user, String name, boolean isDefault) {
        Shelf shelf = Shelf.builder()
                .user(user)
                .name(name)
                .isDefault(isDefault)
                .build();
        return shelfRepository.save(shelf);
    }

    // ---- User's own shelves ----

    @Transactional(readOnly = true)
    public List<Shelf> getCurrentUserShelves() {
        User current = userService.getCurrentUser();
        return shelfRepository.findByUserId(current.getId());
    }

    @Transactional(readOnly = true)
    public List<Shelf> getUserShelves(Long userId) {
        return shelfRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Shelf getShelfById(Long shelfId) {
        Shelf shelf = findShelfOrThrow(shelfId);
        User current = userService.getCurrentUser();
        if (!shelf.getUser().getId().equals(current.getId())) {
            throw new SecurityException("You do not own this shelf");
        }
        return shelf;
    }

    public Shelf createCustomShelf(ShelfRequest request) {
        User current = userService.getCurrentUser();
        if (shelfRepository.existsByUserIdAndName(current.getId(), request.getName())) {
            throw new IllegalArgumentException("You already have a shelf named: " + request.getName());
        }
        return createShelf(current, request.getName(), false);
    }

    public Shelf renameShelf(Long shelfId, ShelfRequest request) {
        Shelf shelf = findShelfOrThrow(shelfId);
        User current = userService.getCurrentUser();
        assertOwnership(shelf, current);

        if (shelf.isDefault()) {
            throw new IllegalArgumentException("Cannot rename default shelves");
        }
        if (shelfRepository.existsByUserIdAndName(current.getId(), request.getName())) {
            throw new IllegalArgumentException("You already have a shelf named: " + request.getName());
        }
        shelf.setName(request.getName());
        return shelfRepository.save(shelf);
    }

    public void deleteShelf(Long shelfId) {
        Shelf shelf = findShelfOrThrow(shelfId);
        User current = userService.getCurrentUser();
        assertOwnership(shelf, current);
        if (shelf.isDefault()) {
            throw new IllegalArgumentException("Cannot delete default shelves");
        }
        shelfRepository.delete(shelf);
    }

    // ---- Adding/removing books ----

    public ShelfBook addBookToShelf(Long shelfId, Long bookId) {
        Shelf shelf = findShelfOrThrow(shelfId);
        User current = userService.getCurrentUser();
        assertOwnership(shelf, current);

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found with id: " + bookId));

        if (shelfBookRepository.existsByShelfIdAndBookId(shelfId, bookId)) {
            throw new IllegalArgumentException("Book is already on this shelf");
        }

        ShelfBook shelfBook = ShelfBook.builder()
                .shelf(shelf)
                .book(book)
                .build();
        ShelfBook saved = shelfBookRepository.save(shelfBook);
        logger.info("User {} added book '{}' to shelf '{}'", current.getUsername(), book.getTitle(), shelf.getName());
        return saved;
    }

    public void removeBookFromShelf(Long shelfId, Long bookId) {
        Shelf shelf = findShelfOrThrow(shelfId);
        User current = userService.getCurrentUser();
        assertOwnership(shelf, current);

        ShelfBook shelfBook = shelfBookRepository.findByShelfIdAndBookId(shelfId, bookId)
                .orElseThrow(() -> new NoSuchElementException("Book not found on shelf"));
        shelfBookRepository.delete(shelfBook);
        logger.info("User {} removed book {} from shelf '{}'", current.getUsername(), bookId, shelf.getName());
    }

    public List<ShelfBook> getShelfBooks(Long shelfId) {
        Shelf shelf = findShelfOrThrow(shelfId);
        User current = userService.getCurrentUser();
        assertOwnership(shelf, current);
        return shelfBookRepository.findByShelfId(shelfId);
    }

    // ---- Convenience: add to named default shelf ----

    public ShelfBook addToWantToRead(Long bookId) {
        return addToDefaultShelf(bookId, WANT_TO_READ);
    }

    public ShelfBook addToCurrentlyReading(Long bookId) {
        return addToDefaultShelf(bookId, CURRENTLY_READING);
    }

    public ShelfBook markAsRead(Long bookId) {
        return addToDefaultShelf(bookId, READ);
    }

    private ShelfBook addToDefaultShelf(Long bookId, String shelfName) {
        User current = userService.getCurrentUser();
        Shelf shelf = shelfRepository.findByUserIdAndName(current.getId(), shelfName)
                .orElseGet(() -> createShelf(current, shelfName, true));
        return addBookToShelf(shelf.getId(), bookId);
    }

    // ---- Helpers ----

    private Shelf findShelfOrThrow(Long shelfId) {
        return shelfRepository.findById(shelfId)
                .orElseThrow(() -> new NoSuchElementException("Shelf not found with id: " + shelfId));
    }

    private void assertOwnership(Shelf shelf, User user) {
        if (!shelf.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not own this shelf");
        }
    }
}