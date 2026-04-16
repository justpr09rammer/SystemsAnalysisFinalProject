import { useState, useEffect, useCallback, useRef } from 'react';
import {
    ArrowLeft, Search, Plus, ChevronUp, ChevronDown, CheckCircle2,
    MessageSquare, Eye, Pin, Lock, Filter, Clock, TrendingUp,
    Flame, Tag, BookOpen, User, Edit2, Trash2, CornerDownRight,
    Award, X, AlertCircle,
} from 'lucide-react';
import { discussionService } from '../services/quizDiscussionService';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function DiscussionRoom({ onBookSelect, toast }) {
    const [view, setView] = useState('list');     // list | thread | create
    const [activeId, setActiveId] = useState(null);
    const [discussions, setDiscussions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    // filters
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [topicFilter, setTopicFilter] = useState('ALL'); // ALL | BOOK | AUTHOR | GENERAL
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQ, setDebouncedQ] = useState('');

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(searchQuery), 400);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const fetchDiscussions = useCallback(async (p = 0) => {
        setLoading(true);
        try {
            let data;
            if (debouncedQ.trim()) {
                data = await discussionService.search(debouncedQ, p);
            } else if (topicFilter !== 'ALL') {
                data = await discussionService.getByTopicType(topicFilter, p);
            } else {
                data = await discussionService.getAll(p, 20, sortBy, sortDir);
            }
            setDiscussions(p === 0 ? data.content : prev => [...prev, ...data.content]);
            setTotalPages(data.totalPages);
            setPage(p);
        } catch {
            toast?.show('Failed to load discussions', 'error');
        } finally {
            setLoading(false);
        }
    }, [debouncedQ, topicFilter, sortBy, sortDir]);

    useEffect(() => { fetchDiscussions(0); }, [fetchDiscussions]);

    const openThread = (id) => { setActiveId(id); setView('thread'); };
    const goBack = () => { setView('list'); setActiveId(null); fetchDiscussions(0); };

    if (view === 'create') {
        return <CreateDiscussionForm
            onCreated={(d) => { fetchDiscussions(0); openThread(d.id); }}
            onCancel={() => setView('list')}
            toast={toast}
        />;
    }

    if (view === 'thread' && activeId) {
        return <ThreadView
            discussionId={activeId}
            onBack={goBack}
            onBookSelect={onBookSelect}
            toast={toast}
        />;
    }

    /* ── LIST VIEW ── */
    return (
        <div>
            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1>Discussions</h1>
                    <p>A forum for readers to share ideas, theories, and reviews.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setView('create')}>
                    <Plus size={16} /> New Thread
                </button>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                {/* Search */}
                <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                    <Search className="search-icon" size={16} />
                    <input
                        className="input"
                        placeholder="Search discussions…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Topic filter */}
                <select className="select" style={{ width: 160 }} value={topicFilter}
                        onChange={e => { setTopicFilter(e.target.value); setPage(0); }}>
                    <option value="ALL">All Topics</option>
                    <option value="BOOK">📚 Book</option>
                    <option value="AUTHOR">✍️ Author</option>
                    <option value="GENERAL">💬 General</option>
                </select>

                {/* Sort */}
                <select className="select" style={{ width: 160 }} value={`${sortBy}_${sortDir}`}
                        onChange={e => {
                            const [s, d] = e.target.value.split('_');
                            setSortBy(s); setSortDir(d);
                        }}>
                    <option value="createdAt_desc">Newest</option>
                    <option value="createdAt_asc">Oldest</option>
                    <option value="viewsCount_desc">Most Viewed</option>
                </select>
            </div>

            {/* List */}
            {loading && discussions.length === 0 ? (
                <div className="loading-center"><div className="spinner" /></div>
            ) : discussions.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">💬</div>
                    <h3>No discussions found</h3>
                    <p>Start the conversation!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    {discussions.map((d, i) => (
                        <DiscussionRow
                            key={d.id}
                            discussion={d}
                            onClick={() => openThread(d.id)}
                            isLast={i === discussions.length - 1}
                        />
                    ))}
                </div>
            )}

            {page < totalPages - 1 && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button className="btn btn-secondary" onClick={() => fetchDiscussions(page + 1)} disabled={loading}>
                        {loading ? 'Loading…' : 'Load more'}
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   DISCUSSION ROW (list item)
───────────────────────────────────────────────────────── */
function DiscussionRow({ discussion: d, onClick, isLast }) {
    const topicColors = {
        BOOK: 'badge-amber', AUTHOR: 'badge-blue', GENERAL: 'badge-green',
    };
    const topicIcons = { BOOK: '📚', AUTHOR: '✍️', GENERAL: '💬' };

    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex', gap: 16, padding: '16px 20px', cursor: 'pointer',
                borderBottom: isLast ? 'none' : '1px solid var(--border)',
                background: 'var(--bg2)', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
        >
            {/* Vote score */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                minWidth: 44, gap: 2, paddingTop: 2,
            }}>
                <span style={{
                    fontWeight: 700, fontSize: '1.1rem',
                    color: d.voteScore > 0 ? 'var(--green)' : d.voteScore < 0 ? 'var(--red)' : 'var(--text3)',
                }}>
                    {d.voteScore > 0 ? '+' : ''}{d.voteScore}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>score</span>
            </div>

            {/* Replies count */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                minWidth: 44, gap: 2, paddingTop: 2,
            }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text2)' }}>{d.postCount}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>replies</span>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {/* Badges row */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {d.pinned && (
                        <span className="badge badge-amber"><Pin size={11} /> Pinned</span>
                    )}
                    {d.closed && (
                        <span className="badge badge-red"><Lock size={11} /> Closed</span>
                    )}
                    <span className={`badge ${topicColors[d.topicType] || 'badge-blue'}`}>
                        {topicIcons[d.topicType]} {d.topicLabel || d.topicType}
                    </span>
                    {d.bookTitle && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>in <em>{d.bookTitle}</em></span>
                    )}
                </div>

                {/* Title */}
                <h3 style={{
                    fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', fontWeight: 600,
                    marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                    {d.title}
                </h3>

                {/* Meta */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
                        by <strong style={{ color: 'var(--text2)' }}>{d.authorUsername}</strong>
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={12} /> {d.viewsCount}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {formatDate(d.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   THREAD VIEW (full discussion + replies)
───────────────────────────────────────────────────────── */
function ThreadView({ discussionId, onBack, onBookSelect, toast }) {
    const { user } = useAuth();
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null); // postId or 'main'
    const [editingPost, setEditingPost] = useState(null); // postId
    const [replyBody, setReplyBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const replyRef = useRef(null);

    const refresh = useCallback(async () => {
        try {
            const d = await discussionService.getById(discussionId);
            setDiscussion(d);
        } catch {
            toast?.show('Failed to load thread', 'error');
        } finally {
            setLoading(false);
        }
    }, [discussionId]);

    useEffect(() => { refresh(); }, [refresh]);

    const handleVoteDiscussion = async (value) => {
        try {
            const score = await discussionService.voteDiscussion(discussionId, value);
            setDiscussion(prev => ({ ...prev, voteScore: score, userVote: prev.userVote === value ? null : value }));
        } catch { toast?.show('Vote failed', 'error'); }
    };

    const handleVotePost = async (postId, value) => {
        try {
            const score = await discussionService.votePost(postId, value);
            refresh(); // easiest way to update nested post scores
        } catch { toast?.show('Vote failed', 'error'); }
    };

    const handleSubmitReply = async () => {
        if (!replyBody.trim()) return;
        setSubmitting(true);
        try {
            const parentId = replyingTo && replyingTo !== 'main' ? replyingTo : null;
            await discussionService.createPost(discussionId, { body: replyBody, parentPostId: parentId });
            setReplyBody('');
            setReplyingTo(null);
            await refresh();
            toast?.show('Reply posted!', 'success');
        } catch {
            toast?.show('Failed to post reply', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Delete this reply?')) return;
        try {
            await discussionService.deletePost(postId);
            await refresh();
            toast?.show('Reply deleted', 'success');
        } catch { toast?.show('Failed to delete', 'error'); }
    };

    const handleDeleteDiscussion = async () => {
        if (!window.confirm('Delete this discussion? This cannot be undone.')) return;
        try {
            await discussionService.delete(discussionId);
            onBack();
            toast?.show('Discussion deleted', 'success');
        } catch { toast?.show('Failed to delete discussion', 'error'); }
    };

    const handleAcceptAnswer = async (postId) => {
        try {
            await discussionService.markAccepted(discussionId, postId);
            await refresh();
            toast?.show('Accepted answer marked!', 'success');
        } catch { toast?.show('Failed to mark answer', 'error'); }
    };

    const handleCloseToggle = async () => {
        try {
            await discussionService.toggleClose(discussionId);
            await refresh();
        } catch { toast?.show('Failed', 'error'); }
    };

    const startReply = (parentId) => {
        setReplyingTo(parentId || 'main');
        setTimeout(() => replyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;
    if (!discussion) return <div className="empty-state"><p>Thread not found.</p></div>;

    const isOwner = user?.id === discussion.authorId;
    const topicColors = { BOOK: 'badge-amber', AUTHOR: 'badge-blue', GENERAL: 'badge-green' };
    const topicIcons = { BOOK: '📚', AUTHOR: '✍️', GENERAL: '💬' };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Back */}
            <button className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={onBack}>
                <ArrowLeft size={16} /> All Discussions
            </button>

            {/* ─── OP (original post) ─── */}
            <div className="card" style={{ marginBottom: 6, borderRadius: '12px 12px 0 0' }}>
                {/* Vote column + content row */}
                <div style={{ display: 'flex', gap: 20 }}>
                    {/* Vote arrows */}
                    <VoteColumn
                        score={discussion.voteScore}
                        userVote={discussion.userVote}
                        onVote={handleVoteDiscussion}
                    />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Tags */}
                        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                            {discussion.pinned && <span className="badge badge-amber"><Pin size={11} /> Pinned</span>}
                            {discussion.closed && <span className="badge badge-red"><Lock size={11} /> Closed</span>}
                            <span className={`badge ${topicColors[discussion.topicType]}`}>
                                {topicIcons[discussion.topicType]} {discussion.topicLabel || discussion.topicType}
                            </span>
                            {discussion.bookTitle && (
                                <span
                                    style={{ fontSize: '0.8rem', color: 'var(--blue)', cursor: 'pointer', textDecoration: 'underline' }}
                                    onClick={() => discussion.bookId && onBookSelect?.(discussion.bookId)}
                                >
                                    {discussion.bookTitle}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 style={{ fontSize: '1.6rem', lineHeight: 1.3, marginBottom: 16 }}>{discussion.title}</h1>

                        {/* Body */}
                        <div style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '0.97rem', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
                            {discussion.body}
                        </div>

                        {/* Author meta */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
                            <div style={{ display: 'flex', gap: 14, color: 'var(--text3)', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Eye size={13} /> {discussion.viewsCount} views
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <MessageSquare size={13} /> {discussion.postCount} replies
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={13} /> {formatDate(discussion.createdAt)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ background: 'var(--surface)', borderRadius: 8, padding: '8px 12px', fontSize: '0.82rem' }}>
                                    <span style={{ color: 'var(--text3)' }}>asked by </span>
                                    <strong style={{ color: 'var(--accent)' }}>{discussion.authorUsername}</strong>
                                </div>
                                {isOwner && (
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <button className="btn btn-ghost btn-icon btn-sm" onClick={handleCloseToggle} title={discussion.closed ? 'Reopen' : 'Close'}>
                                            <Lock size={14} />
                                        </button>
                                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={handleDeleteDiscussion} title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Posts / Replies ─── */}
            {discussion.posts && discussion.posts.length > 0 && (
                <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', marginBottom: 0 }}>
                    {discussion.posts.map((post, i) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            isLast={i === discussion.posts.length - 1}
                            currentUserId={user?.id}
                            discussionAuthorId={discussion.authorId}
                            discussionClosed={discussion.closed}
                            onVote={handleVotePost}
                            onReply={startReply}
                            onDelete={handleDeletePost}
                            onAccept={handleAcceptAnswer}
                            depth={0}
                        />
                    ))}
                </div>
            )}

            {/* ─── Reply box ─── */}
            {!discussion.closed && user ? (
                <div className="card" style={{ marginTop: 4, borderRadius: '0 0 12px 12px' }} ref={replyRef}>
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>
                        {replyingTo && replyingTo !== 'main'
                            ? <span>↩ Replying to a post — <button className="btn btn-ghost" style={{ padding: 0, fontSize: '0.85rem', color: 'var(--text3)' }} onClick={() => setReplyingTo(null)}>cancel</button></span>
                            : 'Your Reply'
                        }
                    </h3>
                    <textarea
                        className="input"
                        rows={5}
                        placeholder="Write a thoughtful reply…"
                        value={replyBody}
                        onChange={e => setReplyBody(e.target.value)}
                        style={{ resize: 'vertical', marginBottom: 12 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-primary" onClick={handleSubmitReply} disabled={submitting || !replyBody.trim()}>
                            {submitting ? 'Posting…' : 'Post Reply'}
                        </button>
                    </div>
                </div>
            ) : discussion.closed ? (
                <div className="alert alert-error" style={{ marginTop: 4 }}>
                    <Lock size={14} style={{ display: 'inline', marginRight: 6 }} />
                    This discussion is closed. No new replies can be added.
                </div>
            ) : (
                <div className="alert" style={{ marginTop: 4, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    Please log in to reply.
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   POST ITEM (reply + nested replies)
───────────────────────────────────────────────────────── */
function PostItem({ post, isLast, currentUserId, discussionAuthorId, discussionClosed, onVote, onReply, onDelete, onAccept, depth }) {
    const [editing, setEditing] = useState(false);
    const [editBody, setEditBody] = useState(post.body);
    const [savingEdit, setSavingEdit] = useState(false);

    const isOwner = currentUserId === post.authorId;
    const isDiscussionOwner = currentUserId === discussionAuthorId;

    const handleSaveEdit = async () => {
        setSavingEdit(true);
        try {
            await discussionService.updatePost(post.id, { body: editBody });
            post.body = editBody; // optimistic
            setEditing(false);
        } catch {
            // revert
        } finally {
            setSavingEdit(false);
        }
    };

    const indentLeft = depth > 0 ? 20 : 0;

    return (
        <div>
            <div style={{
                display: 'flex', gap: 16, padding: '18px 20px',
                paddingLeft: 20 + indentLeft,
                borderBottom: (!isLast || (post.replies && post.replies.length > 0)) ? '1px solid var(--border)' : 'none',
                background: post.acceptedAnswer ? 'rgba(123,198,126,0.04)' : 'transparent',
                borderLeft: post.acceptedAnswer ? '3px solid var(--green)' : depth > 0 ? '3px solid var(--border2)' : 'none',
            }}>
                {/* Vote */}
                <VoteColumn
                    score={post.voteScore}
                    userVote={post.userVote}
                    onVote={(v) => onVote(post.id, v)}
                    small
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Accepted badge */}
                    {post.acceptedAnswer && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--green)', fontSize: '0.82rem', fontWeight: 600 }}>
                            <CheckCircle2 size={14} /> Accepted Answer
                        </div>
                    )}

                    {/* Body */}
                    {editing ? (
                        <div style={{ marginBottom: 12 }}>
                            <textarea
                                className="input"
                                rows={4}
                                value={editBody}
                                onChange={e => setEditBody(e.target.value)}
                                style={{ resize: 'vertical', marginBottom: 8 }}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-primary btn-sm" onClick={handleSaveEdit} disabled={savingEdit}>
                                    {savingEdit ? 'Saving…' : 'Save'}
                                </button>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '0.94rem', marginBottom: 10, whiteSpace: 'pre-wrap' }}>
                            {post.body}
                        </div>
                    )}

                    {/* Meta + actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 10, fontSize: '0.79rem', color: 'var(--text3)', alignItems: 'center' }}>
                            <strong style={{ color: 'var(--text2)' }}>{post.authorUsername}</strong>
                            <span>·</span>
                            <span>{formatDate(post.createdAt)}</span>
                            {post.updatedAt && <span style={{ fontStyle: 'italic' }}>(edited)</span>}
                        </div>

                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {/* Accept answer (discussion owner, not on accepted, not depth reply) */}
                            {isDiscussionOwner && depth === 0 && !post.acceptedAnswer && (
                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--green)', gap: 4 }}
                                        onClick={() => onAccept(post.id)} title="Mark as accepted answer">
                                    <CheckCircle2 size={13} /> Accept
                                </button>
                            )}

                            {/* Reply button */}
                            {!discussionClosed && (
                                <button className="btn btn-ghost btn-sm" onClick={() => onReply(post.id)}>
                                    <CornerDownRight size={13} /> Reply
                                </button>
                            )}

                            {/* Edit */}
                            {isOwner && !editing && (
                                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEditing(true)}>
                                    <Edit2 size={13} />
                                </button>
                            )}

                            {/* Delete */}
                            {(isOwner || currentUserId === discussionAuthorId) && (
                                <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--red)' }}
                                        onClick={() => onDelete(post.id)}>
                                    <Trash2 size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Nested replies */}
            {post.replies && post.replies.length > 0 && (
                <div style={{ marginLeft: 36 }}>
                    {post.replies.map((reply, ri) => (
                        <PostItem
                            key={reply.id}
                            post={reply}
                            isLast={ri === post.replies.length - 1}
                            currentUserId={currentUserId}
                            discussionAuthorId={discussionAuthorId}
                            discussionClosed={discussionClosed}
                            onVote={onVote}
                            onReply={onReply}
                            onDelete={onDelete}
                            onAccept={onAccept}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   VOTE COLUMN
───────────────────────────────────────────────────────── */
function VoteColumn({ score, userVote, onVote, small }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: small ? 28 : 36 }}>
            <button
                onClick={() => onVote(1)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4,
                    color: userVote === 1 ? 'var(--accent)' : 'var(--text3)',
                    transition: 'color 0.15s',
                }}
                title="Upvote"
            >
                <ChevronUp size={small ? 16 : 20} />
            </button>
            <span style={{
                fontWeight: 700, fontSize: small ? '0.85rem' : '1rem',
                color: score > 0 ? 'var(--green)' : score < 0 ? 'var(--red)' : 'var(--text2)',
            }}>
                {score}
            </span>
            <button
                onClick={() => onVote(-1)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4,
                    color: userVote === -1 ? 'var(--blue)' : 'var(--text3)',
                    transition: 'color 0.15s',
                }}
                title="Downvote"
            >
                <ChevronDown size={small ? 16 : 20} />
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   CREATE DISCUSSION FORM
───────────────────────────────────────────────────────── */
function CreateDiscussionForm({ onCreated, onCancel, toast }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [topicType, setTopicType] = useState('GENERAL');
    const [topicLabel, setTopicLabel] = useState('');
    const [bookId, setBookId] = useState('');
    const [books, setBooks] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (topicType === 'BOOK') {
            import('../api/axios').then(({ default: api }) => {
                api.get('/books?size=50').then(r => setBooks(r.data.content || []));
            });
        }
    }, [topicType]);

    const validate = () => {
        const e = {};
        if (!title.trim()) e.title = 'Title is required';
        if (!body.trim()) e.body = 'Body is required';
        if (topicType === 'BOOK' && !bookId) e.book = 'Please select a book';
        if (topicType === 'AUTHOR' && !topicLabel.trim()) e.topicLabel = 'Author name is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            const payload = { title, body, topicType, topicLabel: topicLabel || null, bookId: bookId ? Number(bookId) : null };
            const d = await discussionService.create(payload);
            toast?.show('Discussion created!', 'success');
            onCreated(d);
        } catch (e) {
            toast?.show(e.response?.data?.message || 'Failed to create discussion', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <button className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: 20 }} onClick={onCancel}>
                <ArrowLeft size={16} /> Cancel
            </button>

            <div className="page-header">
                <h1>Start a Discussion</h1>
                <p>Share a thought, theory, or question with the community.</p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Topic type */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Topic Category</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {['GENERAL', 'BOOK', 'AUTHOR'].map(t => (
                            <button
                                key={t}
                                onClick={() => setTopicType(t)}
                                className="btn"
                                style={{
                                    flex: 1, justifyContent: 'center',
                                    background: topicType === t ? 'rgba(232,169,106,0.15)' : 'var(--surface)',
                                    border: `2px solid ${topicType === t ? 'var(--accent)' : 'var(--border2)'}`,
                                    color: topicType === t ? 'var(--accent)' : 'var(--text2)',
                                    fontWeight: topicType === t ? 600 : 400,
                                }}
                            >
                                {{ GENERAL: '💬 General', BOOK: '📚 Book', AUTHOR: '✍️ Author' }[t]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conditional book / author selector */}
                {topicType === 'BOOK' && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Book *</label>
                        <select className="select" value={bookId} onChange={e => setBookId(e.target.value)}>
                            <option value="">Choose a book…</option>
                            {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                        </select>
                        {errors.book && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.book}</p>}
                    </div>
                )}

                {topicType === 'AUTHOR' && (
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">Author Name *</label>
                        <input className="input" placeholder="e.g. Fyodor Dostoevsky" value={topicLabel} onChange={e => setTopicLabel(e.target.value)} />
                        {errors.topicLabel && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.topicLabel}</p>}
                    </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Title *</label>
                    <input className="input" placeholder="Ask a question or state your topic…" value={title} onChange={e => setTitle(e.target.value)} />
                    {errors.title && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.title}</p>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="label">Body *</label>
                    <textarea
                        className="input"
                        rows={8}
                        placeholder="Provide context, share your thoughts, pose a question…"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        style={{ resize: 'vertical' }}
                    />
                    {errors.body && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.body}</p>}
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? 'Posting…' : 'Post Discussion'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────── */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
