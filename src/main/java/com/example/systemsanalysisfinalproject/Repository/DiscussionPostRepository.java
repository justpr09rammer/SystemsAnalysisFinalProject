// DiscussionPostRepository.java
package com.example.systemsanalysisfinalproject.Repository;

import com.example.systemsanalysisfinalproject.Model.DiscussionPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionPostRepository extends JpaRepository<DiscussionPost, Long> {
    List<DiscussionPost> findByDiscussionIdAndParentPostIsNullOrderByCreatedAtAsc(Long discussionId);

    @Query("SELECT COALESCE(SUM(v.value), 0) FROM PostVote v WHERE v.post.id = :postId")
    int sumVotesByPostId(@Param("postId") Long postId);
}
