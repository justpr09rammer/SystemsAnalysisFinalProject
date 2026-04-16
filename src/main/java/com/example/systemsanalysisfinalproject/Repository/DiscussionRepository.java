package com.example.systemsanalysisfinalproject.Repository;

import com.example.systemsanalysisfinalproject.Model.Discussion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    Page<Discussion> findByBookId(Long bookId, Pageable pageable);
    Page<Discussion> findByAuthorId(Long authorId, Pageable pageable);
    Page<Discussion> findByTopicType(Discussion.TopicType topicType, Pageable pageable);

    @Query("SELECT d FROM Discussion d WHERE " +
           "LOWER(d.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(d.body) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Discussion> search(@Param("q") String q, Pageable pageable);

    @Query("SELECT COUNT(p) FROM DiscussionPost p WHERE p.discussion.id = :id")
    long countPostsByDiscussionId(@Param("id") Long id);

    @Query("SELECT COALESCE(SUM(v.value), 0) FROM DiscussionVote v WHERE v.discussion.id = :id")
    int sumVotesByDiscussionId(@Param("id") Long id);
}
