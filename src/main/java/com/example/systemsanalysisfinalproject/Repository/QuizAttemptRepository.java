package com.example.systemsanalysisfinalproject.Repository;

import com.example.systemsanalysisfinalproject.Model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, Long quizId);
    List<QuizAttempt> findByUserId(Long userId);

    @Query("SELECT MAX(a.score) FROM QuizAttempt a WHERE a.user.id = :userId AND a.quiz.id = :quizId")
    Optional<Integer> findBestScoreByUserIdAndQuizId(@Param("userId") Long userId, @Param("quizId") Long quizId);

    long countByUserIdAndQuizId(Long userId, Long quizId);
}
