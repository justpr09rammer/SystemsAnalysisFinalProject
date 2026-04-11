package com.example.systemsanalysisfinalproject.Controller;
 
import com.example.systemsanalysisfinalproject.DTOs.ReadingChallengeRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReadingProgressRequest;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Service.ReadingProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/v1/reading")
@RequiredArgsConstructor
@Tag(name = "Reading Progress", description = "Track reading progress and challenges")
public class ReadingProgressController {
 
    private final ReadingProgressService progressService;
 
    @GetMapping("/progress")
    @Operation(summary = "Get all reading progress for current user")
    public List<ReadingProgress> getMyProgress() {
        return progressService.getCurrentUserProgress();
    }
 
    @GetMapping("/progress/{bookId}")
    @Operation(summary = "Get reading progress for a specific book")
    public ReadingProgress getProgressForBook(@PathVariable Long bookId) {
        return progressService.getProgressForBook(bookId);
    }
 
    @PostMapping("/progress/{bookId}")
    @Operation(summary = "Create or update reading progress for a book")
    public ReadingProgress upsertProgress(
            @PathVariable Long bookId,
            @Valid @RequestBody ReadingProgressRequest request) {
        return progressService.upsertProgress(bookId, request);
    }
 
    @DeleteMapping("/progress/{bookId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete reading progress for a book")
    public void deleteProgress(@PathVariable Long bookId) {
        progressService.deleteProgress(bookId);
    }
 
    // ---- Challenges ----
 
    @GetMapping("/challenges")
    @Operation(summary = "Get all reading challenges for current user")
    public List<ReadingChallenge> getMyChallenges() {
        return progressService.getCurrentUserChallenges();
    }
 
    @GetMapping("/challenges/{year}")
    @Operation(summary = "Get reading challenge for a specific year")
    public ReadingChallenge getChallengeForYear(@PathVariable Integer year) {
        return progressService.getChallengeForYear(year);
    }
 
    @PostMapping("/challenges")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create or update a reading challenge")
    public ReadingChallenge createOrUpdateChallenge(@Valid @RequestBody ReadingChallengeRequest request) {
        return progressService.createOrUpdateChallenge(request);
    }
 
    @PostMapping("/challenges/{year}/sync")
    @Operation(summary = "Sync challenge progress from finished books")
    public ReadingChallenge syncChallenge(@PathVariable Integer year) {
        return progressService.syncChallengeProgress(year);
    }
 
    @DeleteMapping("/challenges/{year}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a reading challenge")
    public void deleteChallenge(@PathVariable Integer year) {
        progressService.deleteChallenge(year);
    }
}