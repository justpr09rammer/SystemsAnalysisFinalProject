package com.example.systemsanalysisfinalproject.Repository;
 
import com.example.systemsanalysisfinalproject.Model.ReadingChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
 
import java.util.List;
import java.util.Optional;
 
@Repository
public interface ReadingChallengeRepository extends JpaRepository<ReadingChallenge, Long> {
    Optional<ReadingChallenge> findByUserIdAndYear(Long userId, Integer year);
    List<ReadingChallenge> findByUserId(Long userId);
}