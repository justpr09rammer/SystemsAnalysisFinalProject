// QuizRepository.java
package com.example.systemsanalysisfinalproject.Repository;

import com.example.systemsanalysisfinalproject.Model.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Page<Quiz> findByBookId(Long bookId, Pageable pageable);
    Page<Quiz> findByCreatorId(Long creatorId, Pageable pageable);
    Page<Quiz> findByQuizTypeAndPublished(Quiz.QuizType quizType, boolean published, Pageable pageable);
    Page<Quiz> findByPublished(boolean published, Pageable pageable);

    @Query("SELECT COUNT(a) FROM QuizAttempt a WHERE a.quiz.id = :quizId")
    long countAttemptsByQuizId(@Param("quizId") Long quizId);
}
