package com.example.systemsanalysisfinalproject.Service;

import com.example.systemsanalysisfinalproject.DTOs.QuizRequest;
import com.example.systemsanalysisfinalproject.DTOs.QuizResponse;
import com.example.systemsanalysisfinalproject.DTOs.QuizSubmitRequest;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Model.User;
import com.example.systemsanalysisfinalproject.Security.Model.UserRole;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final BookService bookService;
    private final UserService userService;

    // ---- Read ----

    @Transactional(readOnly = true)
    public Page<QuizResponse> getAllPublished(Pageable pageable) {
        return quizRepository.findByPublished(true, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<QuizResponse> getQuizzesForBook(Long bookId, Pageable pageable) {
        return quizRepository.findByBookId(bookId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<QuizResponse> getMyQuizzes(Pageable pageable) {
        User current = userService.getCurrentUser();
        return quizRepository.findByCreatorId(current.getId(), pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public QuizResponse getById(Long quizId) {
        Quiz quiz = findOrThrow(quizId);
        return toResponseWithQuestions(quiz);
    }

    // ---- Create ----

    public QuizResponse createQuiz(QuizRequest request) {
        User current = userService.getCurrentUser();
        Book book = bookService.findBookOrThrow(request.getBookId());

        Quiz.QuizType type = current.getUserRole() == UserRole.ADMIN
                ? Quiz.QuizType.VERIFIED
                : Quiz.QuizType.USER_CREATED;

        Quiz quiz = Quiz.builder()
                .book(book)
                .creator(current)
                .title(request.getTitle())
                .description(request.getDescription())
                .quizType(type)
                .published(true)
                .build();

        // Build questions
        List<QuizQuestion> questions = new ArrayList<>();
        for (int i = 0; i < request.getQuestions().size(); i++) {
            QuizRequest.QuestionRequest qReq = request.getQuestions().get(i);

            // Validate at least one correct option
            boolean hasCorrect = qReq.getOptions().stream().anyMatch(QuizRequest.OptionRequest::isCorrect);
            if (!hasCorrect) {
                throw new IllegalArgumentException(
                        "Question #" + (i + 1) + " must have at least one correct answer");
            }

            QuizQuestion question = QuizQuestion.builder()
                    .quiz(quiz)
                    .questionText(qReq.getQuestionText())
                    .questionOrder(i)
                    .build();

            List<QuizOption> options = new ArrayList<>();
            for (int j = 0; j < qReq.getOptions().size(); j++) {
                QuizRequest.OptionRequest oReq = qReq.getOptions().get(j);
                options.add(QuizOption.builder()
                        .question(question)
                        .optionText(oReq.getOptionText())
                        .correct(oReq.isCorrect())
                        .optionOrder(j)
                        .build());
            }
            question.setOptions(options);
            questions.add(question);
        }

        quiz.setQuestions(questions);
        Quiz saved = quizRepository.save(quiz);
        return toResponseWithQuestions(saved);
    }

    // ---- Submit attempt ----

    public Map<String, Object> submitAttempt(Long quizId, QuizSubmitRequest request) {
        User current = userService.getCurrentUser();
        Quiz quiz = findOrThrow(quizId);

        if (!quiz.isPublished()) {
            throw new IllegalStateException("This quiz is not published");
        }

        Map<Long, Long> answers = request.getAnswers(); // questionId -> optionId

        int score = 0;
        Map<Long, Boolean> questionResults = new LinkedHashMap<>();
        Map<Long, Long> correctOptions = new HashMap<>();

        for (QuizQuestion question : quiz.getQuestions()) {
            Long selectedOptionId = answers.get(question.getId());
            boolean correct = false;
            Long correctOptionId = null;

            for (QuizOption option : question.getOptions()) {
                if (option.isCorrect()) {
                    correctOptionId = option.getId();
                }
                if (option.isCorrect() && option.getId().equals(selectedOptionId)) {
                    correct = true;
                    score++;
                }
            }
            questionResults.put(question.getId(), correct);
            correctOptions.put(question.getId(), correctOptionId);
        }

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .user(current)
                .score(score)
                .totalQuestions(quiz.getQuestions().size())
                .build();
        attemptRepository.save(attempt);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("quizId", quizId);
        result.put("score", score);
        result.put("totalQuestions", quiz.getQuestions().size());
        result.put("scorePercent", quiz.getQuestions().isEmpty() ? 0 :
                Math.round((score * 100.0) / quiz.getQuestions().size()));
        result.put("questionResults", questionResults);
        result.put("correctOptions", correctOptions);

        return result;
    }

    // ---- Delete ----

    public void deleteQuiz(Long quizId) {
        User current = userService.getCurrentUser();
        Quiz quiz = findOrThrow(quizId);
        boolean isAdmin = current.getUserRole() == UserRole.ADMIN;
        if (!isAdmin && !quiz.getCreator().getId().equals(current.getId())) {
            throw new SecurityException("You do not own this quiz");
        }
        quizRepository.delete(quiz);
    }

    // ---- My attempts ----

    @Transactional(readOnly = true)
    public List<QuizAttempt> getMyAttempts() {
        User current = userService.getCurrentUser();
        return attemptRepository.findByUserId(current.getId());
    }

    @Transactional(readOnly = true)
    public List<QuizAttempt> getAttemptsForQuiz(Long quizId) {
        User current = userService.getCurrentUser();
        return attemptRepository.findByUserIdAndQuizId(current.getId(), quizId);
    }

    // ---- Mapping ----

    private QuizResponse toResponse(Quiz quiz) {
        User current = null;
        try { current = userService.getCurrentUser(); } catch (Exception ignored) {}

        Integer bestScore = null;
        Integer attemptCount = null;
        if (current != null) {
            bestScore = attemptRepository.findBestScoreByUserIdAndQuizId(current.getId(), quiz.getId()).orElse(null);
            attemptCount = (int) attemptRepository.countByUserIdAndQuizId(current.getId(), quiz.getId());
        }

        return QuizResponse.builder()
                .id(quiz.getId())
                .bookId(quiz.getBook().getId())
                .bookTitle(quiz.getBook().getTitle())
                .bookCoverUrl(quiz.getBook().getCoverImageUrl())
                .creatorId(quiz.getCreator().getId())
                .creatorUsername(quiz.getCreator().getUsername())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .quizType(quiz.getQuizType())
                .published(quiz.isPublished())
                .createdAt(quiz.getCreatedAt())
                .questionCount(quiz.getQuestions().size())
                .attemptCount((int) quizRepository.countAttemptsByQuizId(quiz.getId()))
                .userBestScore(bestScore)
                .userAttemptCount(attemptCount)
                .build();
    }

    private QuizResponse toResponseWithQuestions(Quiz quiz) {
        QuizResponse resp = toResponse(quiz);

        List<QuizResponse.QuestionResponse> questionResponses = quiz.getQuestions().stream()
                .sorted(Comparator.comparing(QuizQuestion::getQuestionOrder))
                .map(q -> QuizResponse.QuestionResponse.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .questionOrder(q.getQuestionOrder())
                        .options(q.getOptions().stream()
                                .sorted(Comparator.comparing(QuizOption::getOptionOrder))
                                .map(o -> QuizResponse.OptionResponse.builder()
                                        .id(o.getId())
                                        .optionText(o.getOptionText())
                                        .correct(false) // never expose answer during quiz
                                        .optionOrder(o.getOptionOrder())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        resp.setQuestions(questionResponses);
        return resp;
    }

    private Quiz findOrThrow(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
    }
}
