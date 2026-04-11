package com.example.systemsanalysisfinalproject.Service;
 
import com.example.systemsanalysisfinalproject.DTOs.ReadingProgressRequest;
import com.example.systemsanalysisfinalproject.DTOs.ReadingChallengeRequest;
import com.example.systemsanalysisfinalproject.Model.*;
import com.example.systemsanalysisfinalproject.Security.Model.*;

import com.example.systemsanalysisfinalproject.Repository.*;
import com.example.systemsanalysisfinalproject.Security.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
import java.util.NoSuchElementException;
 
@Service
@Transactional
@RequiredArgsConstructor
public class ReadingProgressService {
 
    private final ReadingProgressRepository progressRepository;
    private final ReadingChallengeRepository challengeRepository;
    private final BookService bookService;
    private final UserService userService;
 
    @Transactional(readOnly = true)
    public List<ReadingProgress> getCurrentUserProgress() {
        User current = userService.getCurrentUser();
        return progressRepository.findByUserId(current.getId());
    }
 
    @Transactional(readOnly = true)
    public ReadingProgress getProgressForBook(Long bookId) {
        User current = userService.getCurrentUser();
        return progressRepository.findByUserIdAndBookId(current.getId(), bookId)
                .orElseThrow(() -> new NoSuchElementException("No progress found for this book"));
    }
 
    public ReadingProgress upsertProgress(Long bookId, ReadingProgressRequest request) {
        User current = userService.getCurrentUser();
        Book book = bookService.findBookOrThrow(bookId);
 
        ReadingProgress progress = progressRepository.findByUserIdAndBookId(current.getId(), bookId)
                .orElse(ReadingProgress.builder().user(current).book(book).build());
 
        if (request.getCurrentPage() != null) progress.setCurrentPage(request.getCurrentPage());
        if (request.getStartDate() != null) progress.setStartDate(request.getStartDate());
        if (request.getFinishDate() != null) {
            progress.setFinishDate(request.getFinishDate());
            if (book.getPageCount() != null) progress.setCurrentPage(book.getPageCount());
        }
 
        return progressRepository.save(progress);
    }
 
    public void deleteProgress(Long bookId) {
        User current = userService.getCurrentUser();
        ReadingProgress progress = progressRepository.findByUserIdAndBookId(current.getId(), bookId)
                .orElseThrow(() -> new NoSuchElementException("No progress found for this book"));
        progressRepository.delete(progress);
    }
 

    @Transactional(readOnly = true)
    public List<ReadingChallenge> getCurrentUserChallenges() {
        User current = userService.getCurrentUser();
        return challengeRepository.findByUserId(current.getId());
    }
 
    @Transactional(readOnly = true)
    public ReadingChallenge getChallengeForYear(Integer year) {
        User current = userService.getCurrentUser();
        return challengeRepository.findByUserIdAndYear(current.getId(), year)
                .orElseThrow(() -> new NoSuchElementException("No challenge found for year: " + year));
    }
 
    public ReadingChallenge createOrUpdateChallenge(ReadingChallengeRequest request) {
        User current = userService.getCurrentUser();
        ReadingChallenge challenge = challengeRepository.findByUserIdAndYear(current.getId(), request.getYear())
                .orElse(ReadingChallenge.builder()
                        .user(current)
                        .year(request.getYear())
                        .booksRead(0)
                        .build());
        challenge.setGoalBooks(request.getGoalBooks());
        return challengeRepository.save(challenge);
    }
 
    public ReadingChallenge syncChallengeProgress(Integer year) {
        User current = userService.getCurrentUser();
        ReadingChallenge challenge = challengeRepository.findByUserIdAndYear(current.getId(), year)
                .orElseThrow(() -> new NoSuchElementException("No challenge for year " + year));
 
        long count = progressRepository.findByUserId(current.getId()).stream()
                .filter(p -> p.getFinishDate() != null && p.getFinishDate().getYear() == year)
                .count();
 
        challenge.setBooksRead((int) count);
        return challengeRepository.save(challenge);
    }
 
    public void deleteChallenge(Integer year) {
        User current = userService.getCurrentUser();
        ReadingChallenge challenge = challengeRepository.findByUserIdAndYear(current.getId(), year)
                .orElseThrow(() -> new NoSuchElementException("No challenge for year " + year));
        challengeRepository.delete(challenge);
    }
}