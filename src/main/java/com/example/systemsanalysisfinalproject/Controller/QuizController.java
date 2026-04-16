package com.example.systemsanalysisfinalproject.Controller;

import com.example.systemsanalysisfinalproject.DTOs.QuizRequest;
import com.example.systemsanalysisfinalproject.DTOs.QuizResponse;
import com.example.systemsanalysisfinalproject.DTOs.QuizSubmitRequest;
import com.example.systemsanalysisfinalproject.Model.QuizAttempt;
import com.example.systemsanalysisfinalproject.Service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/quizzes")
@RequiredArgsConstructor
@Tag(name = "Quizzes", description = "Create, browse, and take book quizzes")
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    @Operation(summary = "Get all published quizzes")
    public Page<QuizResponse> getAllPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return quizService.getAllPublished(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get quizzes for a specific book")
    public Page<QuizResponse> getForBook(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return quizService.getQuizzesForBook(bookId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/my-quizzes")
    @Operation(summary = "Get quizzes created by the current user")
    public Page<QuizResponse> getMyQuizzes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return quizService.getMyQuizzes(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/my-attempts")
    @Operation(summary = "Get all quiz attempts by the current user")
    public List<QuizAttempt> getMyAttempts() {
        return quizService.getMyAttempts();
    }

    @GetMapping("/{quizId}")
    @Operation(summary = "Get a quiz with all its questions (answers hidden)")
    public QuizResponse getById(@PathVariable Long quizId) {
        return quizService.getById(quizId);
    }

    @GetMapping("/{quizId}/attempts")
    @Operation(summary = "Get current user's attempts for a specific quiz")
    public List<QuizAttempt> getAttemptsForQuiz(@PathVariable Long quizId) {
        return quizService.getAttemptsForQuiz(quizId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new quiz")
    public QuizResponse createQuiz(@Valid @RequestBody QuizRequest request) {
        return quizService.createQuiz(request);
    }

    @PostMapping("/{quizId}/submit")
    @Operation(summary = "Submit answers for a quiz and receive results")
    public Map<String, Object> submitQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizSubmitRequest request) {
        return quizService.submitAttempt(quizId, request);
    }

    @DeleteMapping("/{quizId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a quiz (creator or admin only)")
    public void deleteQuiz(@PathVariable Long quizId) {
        quizService.deleteQuiz(quizId);
    }
}
