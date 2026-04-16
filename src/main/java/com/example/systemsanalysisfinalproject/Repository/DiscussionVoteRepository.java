package com.example.systemsanalysisfinalproject.Repository;

import com.example.systemsanalysisfinalproject.Model.DiscussionVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscussionVoteRepository extends JpaRepository<DiscussionVote, Long> {
    Optional<DiscussionVote> findByUserIdAndDiscussionId(Long userId, Long discussionId);
    boolean existsByUserIdAndDiscussionId(Long userId, Long discussionId);
}
