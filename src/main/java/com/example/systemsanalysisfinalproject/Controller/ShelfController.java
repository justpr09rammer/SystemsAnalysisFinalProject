package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.ShelfRequest;
import com.example.systemsanalysisfinalproject.Model.Shelf;
import com.example.systemsanalysisfinalproject.Model.ShelfBook;
import com.example.systemsanalysisfinalproject.Service.ShelfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/v1/shelves")
@RequiredArgsConstructor
@Tag(name = "Shelves", description = "Manage reading shelves")
public class ShelfController {
 
    private final ShelfService shelfService;
 
    @GetMapping
    @Operation(summary = "Get current user's shelves")
    public List<Shelf> getMyShelves() {
        return shelfService.getCurrentUserShelves();
    }
 
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get shelves for a user")
    public List<Shelf> getUserShelves(@PathVariable Long userId) {
        return shelfService.getUserShelves(userId);
    }
 
    @GetMapping("/{shelfId}")
    @Operation(summary = "Get a shelf")
    public Shelf getShelf(@PathVariable Long shelfId) {
        return shelfService.getShelfById(shelfId);
    }
 
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a custom shelf")
    public Shelf createShelf(@Valid @RequestBody ShelfRequest request) {
        return shelfService.createCustomShelf(request);
    }
 
    @PatchMapping("/{shelfId}")
    @Operation(summary = "Rename a custom shelf")
    public Shelf renameShelf(@PathVariable Long shelfId, @Valid @RequestBody ShelfRequest request) {
        return shelfService.renameShelf(shelfId, request);
    }
 
    @DeleteMapping("/{shelfId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a custom shelf")
    public void deleteShelf(@PathVariable Long shelfId) {
        shelfService.deleteShelf(shelfId);
    }
 
    @GetMapping("/{shelfId}/books")
    @Operation(summary = "Get books on a shelf")
    public List<ShelfBook> getShelfBooks(@PathVariable Long shelfId) {
        return shelfService.getShelfBooks(shelfId);
    }
 
    @PostMapping("/{shelfId}/books/{bookId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a book to a shelf")
    public ShelfBook addBookToShelf(@PathVariable Long shelfId, @PathVariable Long bookId) {
        return shelfService.addBookToShelf(shelfId, bookId);
    }
 
    @DeleteMapping("/{shelfId}/books/{bookId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remove a book from a shelf")
    public void removeBookFromShelf(@PathVariable Long shelfId, @PathVariable Long bookId) {
        shelfService.removeBookFromShelf(shelfId, bookId);
    }
 
    // Convenience endpoints
    @PostMapping("/want-to-read/{bookId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add book to want-to-read shelf")
    public ShelfBook addToWantToRead(@PathVariable Long bookId) {
        return shelfService.addToWantToRead(bookId);
    }
 
    @PostMapping("/currently-reading/{bookId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Mark book as currently reading")
    public ShelfBook addToCurrentlyReading(@PathVariable Long bookId) {
        return shelfService.addToCurrentlyReading(bookId);
    }
 
    @PostMapping("/read/{bookId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Mark book as read")
    public ShelfBook markAsRead(@PathVariable Long bookId) {
        return shelfService.markAsRead(bookId);
    }
}
 