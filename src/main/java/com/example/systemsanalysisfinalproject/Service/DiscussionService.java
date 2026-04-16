package com.example.systemsanalysisfinalproject.Service;

import com.example.systemsanalysisfinalproject.DTOs.DiscussionRequest;
import com.example.systemsanalysisfinalproject.DTOs.DiscussionResponse;
import com.example.systemsanalysisfinalproject.DTOs.PostRequest;
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
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final DiscussionPostRepository postRepository;
    private final DiscussionVoteRepository discussionVoteRepository;
    private final PostVoteRepository postVoteRepository;
    private final BookService bookService;
    private final UserService userService;

    // ---- Discussions (threads) ----

    @Transactional(readOnly = true)
    public Page<DiscussionResponse> getAll(Pageable pageable) {
        return discussionRepository.findAll(pageable).map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<DiscussionResponse> getByBook(Long bookId, Pageable pageable) {
        return discussionRepository.findByBookId(bookId, pageable).map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<DiscussionResponse> getByTopicType(Discussion.TopicType type, Pageable pageable) {
        return discussionRepository.findByTopicType(type, pageable).map(this::toSummaryResponse);
    }

    @Transactional(readOnly = true)
    public Page<DiscussionResponse> search(String query, Pageable pageable) {
        return discussionRepository.search(query, pageable).map(this::toSummaryResponse);
    }

    @Transactional
    public DiscussionResponse getById(Long discussionId) {
        Discussion discussion = findOrThrow(discussionId);
        // increment view count
        discussion.setViewsCount((discussion.getViewsCount() == null ? 0 : discussion.getViewsCount()) + 1);
        discussionRepository.save(discussion);
        return toDetailResponse(discussion);
    }

    public DiscussionResponse createDiscussion(DiscussionRequest request) {
        User current = userService.getCurrentUser();

        Discussion.Builder builder = Discussion.builder()
                .author(current)
                .title(request.getTitle())
                .body(request.getBody())
                .topicType(request.getTopicType() != null ? request.getTopicType() : Discussion.TopicType.GENERAL)
                .topicLabel(request.getTopicLabel())
                .pinned(false)
                .closed(false);

        if (request.getBookId() != null) {
            Book book = bookService.findBookOrThrow(request.getBookId());
            builder.book(book);
        }

        Discussion saved = discussionRepository.save(builder.build());
        return toDetailResponse(saved);
    }

    public DiscussionResponse updateDiscussion(Long discussionId, DiscussionRequest request) {
        User current = userService.getCurrentUser();
        Discussion discussion = findOrThrow(discussionId);
        assertDiscussionOwnership(discussion, current);

        if (request.getTitle() != null) discussion.setTitle(request.getTitle());
        if (request.getBody() != null) discussion.setBody(request.getBody());

        return toDetailResponse(discussionRepository.save(discussion));
    }

    public void deleteDiscussion(Long discussionId) {
        User current = userService.getCurrentUser();
        Discussion discussion = findOrThrow(discussionId);
        boolean isAdmin = current.getUserRole() == UserRole.ADMIN;
        if (!isAdmin) assertDiscussionOwnership(discussion, current);
        discussionRepository.delete(discussion);
    }

    // ---- Admin: pin / close ----

    public DiscussionResponse togglePin(Long discussionId) {
        Discussion discussion = findOrThrow(discussionId);
        discussion.setPinned(!discussion.isPinned());
        return toSummaryResponse(discussionRepository.save(discussion));
    }

    public DiscussionResponse toggleClose(Long discussionId) {
        User current = userService.getCurrentUser();
        Discussion discussion = findOrThrow(discussionId);
        boolean isAdmin = current.getUserRole() == UserRole.ADMIN;
        if (!isAdmin) assertDiscussionOwnership(discussion, current);
        discussion.setClosed(!discussion.isClosed());
        return toSummaryResponse(discussionRepository.save(discussion));
    }

    // ---- Posts (replies) ----

    public DiscussionResponse.PostResponse createPost(Long discussionId, PostRequest request) {
        User current = userService.getCurrentUser();
        Discussion discussion = findOrThrow(discussionId);

        if (discussion.isClosed()) {
            throw new IllegalStateException("This discussion is closed");
        }

        DiscussionPost.DiscussionPostBuilder builder = DiscussionPost.builder()
                .discussion(discussion)
                .author(current)
                .body(request.getBody())
                .acceptedAnswer(false);

        if (request.getParentPostId() != null) {
            DiscussionPost parent = postRepository.findById(request.getParentPostId())
                    .orElseThrow(() -> new NoSuchElementException("Parent post not found"));
            if (!parent.getDiscussion().getId().equals(discussionId)) {
                throw new IllegalArgumentException("Parent post does not belong to this discussion");
            }
            builder.parentPost(parent);
        }

        DiscussionPost saved = postRepository.save(builder.build());
        return toPostResponse(saved);
    }

    public DiscussionResponse.PostResponse updatePost(Long postId, PostRequest request) {
        User current = userService.getCurrentUser();
        DiscussionPost post = findPostOrThrow(postId);
        assertPostOwnership(post, current);
        post.setBody(request.getBody());
        return toPostResponse(postRepository.save(post));
    }

    public void deletePost(Long postId) {
        User current = userService.getCurrentUser();
        DiscussionPost post = findPostOrThrow(postId);
        boolean isAdmin = current.getUserRole() == UserRole.ADMIN;
        if (!isAdmin) assertPostOwnership(post, current);
        postRepository.delete(post);
    }

    public DiscussionResponse.PostResponse markAcceptedAnswer(Long discussionId, Long postId) {
        User current = userService.getCurrentUser();
        Discussion discussion = findOrThrow(discussionId);
        assertDiscussionOwnership(discussion, current);

        DiscussionPost post = findPostOrThrow(postId);
        if (!post.getDiscussion().getId().equals(discussionId)) {
            throw new IllegalArgumentException("Post does not belong to this discussion");
        }

        // un-accept all others first
        postRepository.findByDiscussionIdAndParentPostIsNullOrderByCreatedAtAsc(discussionId)
                .forEach(p -> { p.setAcceptedAnswer(false); postRepository.save(p); });

        post.setAcceptedAnswer(true);
        return toPostResponse(postRepository.save(post));
    }

    // ---- Voting ----

    public int voteDiscussion(Long discussionId, int value) {
        if (value != 1 && value != -1) throw new IllegalArgumentException("Vote value must be +1 or -1");
        User current = userService.getCurrentUser();
        Discussion discussion = findOrThrow(discussionId);

        Optional<DiscussionVote> existing = discussionVoteRepository
                .findByUserIdAndDiscussionId(current.getId(), discussionId);

        if (existing.isPresent()) {
            DiscussionVote vote = existing.get();
            if (vote.getValue() == value) {
                // same vote = remove (toggle off)
                discussionVoteRepository.delete(vote);
            } else {
                vote.setValue(value);
                discussionVoteRepository.save(vote);
            }
        } else {
            discussionVoteRepository.save(DiscussionVote.builder()
                    .user(current)
                    .discussion(discussion)
                    .value(value)
                    .build());
        }
        return discussionRepository.sumVotesByDiscussionId(discussionId);
    }

    public int votePost(Long postId, int value) {
        if (value != 1 && value != -1) throw new IllegalArgumentException("Vote value must be +1 or -1");
        User current = userService.getCurrentUser();
        DiscussionPost post = findPostOrThrow(postId);

        Optional<PostVote> existing = postVoteRepository
                .findByUserIdAndPostId(current.getId(), postId);

        if (existing.isPresent()) {
            PostVote vote = existing.get();
            if (vote.getValue() == value) {
                postVoteRepository.delete(vote);
            } else {
                vote.setValue(value);
                postVoteRepository.save(vote);
            }
        } else {
            postVoteRepository.save(PostVote.builder()
                    .user(current)
                    .post(post)
                    .value(value)
                    .build());
        }
        return postRepository.sumVotesByPostId(postId);
    }

    // ---- Mapping helpers ----

    private DiscussionResponse toSummaryResponse(Discussion d) {
        Integer userVote = getUserVoteForDiscussion(d.getId());
        return DiscussionResponse.builder()
                .id(d.getId())
                .authorId(d.getAuthor().getId())
                .authorUsername(d.getAuthor().getUsername())
                .bookId(d.getBook() != null ? d.getBook().getId() : null)
                .bookTitle(d.getBook() != null ? d.getBook().getTitle() : null)
                .bookCoverUrl(d.getBook() != null ? d.getBook().getCoverImageUrl() : null)
                .title(d.getTitle())
                .body(d.getBody())
                .topicType(d.getTopicType())
                .topicLabel(d.getTopicLabel())
                .createdAt(d.getCreatedAt())
                .updatedAt(d.getUpdatedAt())
                .pinned(d.isPinned())
                .closed(d.isClosed())
                .viewsCount(d.getViewsCount() == null ? 0 : d.getViewsCount())
                .postCount((int) discussionRepository.countPostsByDiscussionId(d.getId()))
                .voteScore(discussionRepository.sumVotesByDiscussionId(d.getId()))
                .userVote(userVote)
                .build();
    }

    private DiscussionResponse toDetailResponse(Discussion d) {
        DiscussionResponse resp = toSummaryResponse(d);

        List<DiscussionPost> topLevel =
                postRepository.findByDiscussionIdAndParentPostIsNullOrderByCreatedAtAsc(d.getId());

        resp.setPosts(topLevel.stream().map(this::toPostResponseWithReplies).collect(Collectors.toList()));
        return resp;
    }

    private DiscussionResponse.PostResponse toPostResponseWithReplies(DiscussionPost post) {
        DiscussionResponse.PostResponse resp = toPostResponse(post);
        List<DiscussionResponse.PostResponse> replies = post.getReplies().stream()
                .sorted(Comparator.comparing(DiscussionPost::getCreatedAt))
                .map(this::toPostResponse)
                .collect(Collectors.toList());
        resp.setReplies(replies);
        return resp;
    }

    private DiscussionResponse.PostResponse toPostResponse(DiscussionPost post) {
        Integer userVote = getUserVoteForPost(post.getId());
        return DiscussionResponse.PostResponse.builder()
                .id(post.getId())
                .authorId(post.getAuthor().getId())
                .authorUsername(post.getAuthor().getUsername())
                .body(post.getBody())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .acceptedAnswer(post.isAcceptedAnswer())
                .voteScore(postRepository.sumVotesByPostId(post.getId()))
                .userVote(userVote)
                .parentPostId(post.getParentPost() != null ? post.getParentPost().getId() : null)
                .replies(new ArrayList<>())
                .build();
    }

    private Integer getUserVoteForDiscussion(Long discussionId) {
        try {
            User current = userService.getCurrentUser();
            return discussionVoteRepository.findByUserIdAndDiscussionId(current.getId(), discussionId)
                    .map(DiscussionVote::getValue).orElse(null);
        } catch (Exception e) { return null; }
    }

    private Integer getUserVoteForPost(Long postId) {
        try {
            User current = userService.getCurrentUser();
            return postVoteRepository.findByUserIdAndPostId(current.getId(), postId)
                    .map(PostVote::getValue).orElse(null);
        } catch (Exception e) { return null; }
    }

    private Discussion findOrThrow(Long id) {
        return discussionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Discussion not found with id: " + id));
    }

    private DiscussionPost findPostOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Post not found with id: " + id));
    }

    private void assertDiscussionOwnership(Discussion d, User user) {
        if (!d.getAuthor().getId().equals(user.getId())) {
            throw new SecurityException("You do not own this discussion");
        }
    }

    private void assertPostOwnership(DiscussionPost post, User user) {
        if (!post.getAuthor().getId().equals(user.getId())) {
            throw new SecurityException("You do not own this post");
        }
    }
}
