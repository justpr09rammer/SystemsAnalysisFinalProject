import { useState, useEffect } from 'react';
import { bookService, shelfService, reviewService, progressService } from '../services/api';
import { BookCover, Stars, LoadingCenter, Modal, Alert } from '../components/UI';
import { useAuth } from '../context/AuthContext';

function ReviewCard({ review, onLike, currentUserId, onDelete }) {
    return (
        <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface2)', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                        {review.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <Stars rating={review.rating} size={14} />
            </div>
            {review.body && <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{review.body}</p>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-ghost btn-sm" style={{ gap: 6, padding: '4px 10px' }} onClick={() => onLike(review.id, review.likedByCurrentUser)}>
                    <span style={{ color: review.likedByCurrentUser ? 'var(--accent)' : 'var(--text3)' }}>♥</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{review.likesCount}</span>
                </button>
                {currentUserId === review.userId && (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: '4px 10px' }} onClick={() => onDelete(review.id)}>Delete</button>
                )}
            </div>
        </div>
    );
}

export default function BookDetailPage({ bookId, onBack, toast }) {
    const { isAuthenticated, user } = useAuth();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 0, body: '' });
    const [shelfLoading, setShelfLoading] = useState(false);
    const [progressModal, setProgressModal] = useState(false);
    const [progressInput, setProgressInput] = useState('');
    const [similar, setSimilar] = useState([]);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [bRes, rRes] = await Promise.all([
                    bookService.getById(bookId),
                    reviewService.getForBook(bookId, 0)
                ]);
                setBook(bRes.data);
                setReviews(rRes.data?.content || []);
                if (isAuthenticated) {
                    try { const p = await progressService.getProgressForBook(bookId); setProgress(p.data); } catch {}
                    bookService.getSimilar(bookId, 4).then(r => setSimilar(r.data || [])).catch(() => {});
                }
            } catch { toast?.error('Failed to load book'); }
            setLoading(false);
        };
        load();
    }, [bookId, isAuthenticated]);

    const handleShelfAction = async (action) => {
        if (!isAuthenticated) { toast?.error('Please sign in to manage shelves'); return; }
        setShelfLoading(true);
        try {
            if (action === 'want') await shelfService.addToWantToRead(bookId);
            else if (action === 'reading') await shelfService.addToCurrentlyReading(bookId);
            else if (action === 'read') await shelfService.markAsRead(bookId);
            const r = await bookService.getById(bookId);
            setBook(r.data);
            toast?.success('Shelf updated!');
        } catch (e) { toast?.error(e.response?.data?.message || 'Failed to update shelf'); }
        setShelfLoading(false);
    };

    const handleReview = async () => {
        if (!reviewForm.rating) { setReviewError('Please select a rating'); return; }
        setReviewError('');
        try {
            await reviewService.create(bookId, reviewForm);
            const r = await reviewService.getForBook(bookId, 0);
            setReviews(r.data?.content || []);
            setReviewModal(false);
            setReviewForm({ rating: 0, body: '' });
            toast?.success('Review submitted!');
        } catch (e) { setReviewError(e.response?.data?.message || 'Failed to submit review'); }
    };

    const handleLike = async (reviewId, liked) => {
        if (!isAuthenticated) return;
        try {
            if (liked) await reviewService.unlike(reviewId);
            else await reviewService.like(reviewId);
            const r = await reviewService.getForBook(bookId, 0);
            setReviews(r.data?.content || []);
        } catch {}
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await reviewService.delete(reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
            toast?.success('Review deleted');
        } catch {}
    };

    const handleProgressUpdate = async () => {
        const page = parseInt(progressInput);
        if (isNaN(page) || page < 0) return;
        try {
            const r = await progressService.upsertProgress(bookId, { currentPage: page });
            setProgress(r.data);
            setProgressModal(false);
            toast?.success('Progress updated!');
        } catch {}
    };

    if (loading) return <LoadingCenter />;
    if (!book) return <div>Book not found</div>;

    const pct = progress && book.pageCount ? Math.min(100, Math.round((progress.currentPage / book.pageCount) * 100)) : 0;

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <button className="btn btn-ghost" style={{ marginBottom: 24, paddingLeft: 0 }} onClick={onBack}>
                ← Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, marginBottom: 40 }}>
                {/* Left: Cover + Actions */}
                <div>
                    <BookCover src={book.coverImageUrl} title={book.title} width={220} height={330} />

                    {isAuthenticated && (
                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleShelfAction('reading')} disabled={shelfLoading}>
                                📖 Currently Reading
                            </button>
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleShelfAction('want')} disabled={shelfLoading}>
                                🔖 Want to Read
                            </button>
                            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleShelfAction('read')} disabled={shelfLoading}>
                                ✅ Mark as Read
                            </button>
                            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--border2)' }} onClick={() => { setProgressInput(progress?.currentPage || 0); setProgressModal(true); }}>
                                📊 Update Progress
                            </button>
                        </div>
                    )}

                    {book.userShelves?.length > 0 && (
                        <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--surface)', borderRadius: 8 }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 4 }}>On your shelves</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {book.userShelves.map(s => (
                                    <span key={s} style={{ background: 'rgba(232,169,106,0.15)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {book.genres?.map(g => <span key={g.id} className="badge badge-blue">{g.name}</span>)}
                    </div>

                    <h1 style={{ fontSize: '2.2rem', marginBottom: 8, lineHeight: 1.2 }}>{book.title}</h1>
                    <p style={{ color: 'var(--text2)', fontSize: '1.05rem', marginBottom: 16 }}>
                        by {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Stars rating={Math.round(book.averageRating || 0)} size={18} />
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{Number(book.averageRating || 0).toFixed(1)}</span>
                            <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>({book.ratingsCount || 0} ratings)</span>
                        </div>
                        {book.pageCount && <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>📄 {book.pageCount} pages</span>}
                        {book.language && <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>🌐 {book.language.toUpperCase()}</span>}
                        {book.publishedDate && <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>📅 {new Date(book.publishedDate).getFullYear()}</span>}
                    </div>

                    {/* Reading progress */}
                    {isAuthenticated && progress && (
                        <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Your Progress</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{pct}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 6 }}>
                                Page {progress.currentPage} of {book.pageCount}
                            </div>
                        </div>
                    )}

                    {book.description && (
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>About this book</h3>
                            <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '0.95rem' }}>{book.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: '1.4rem' }}>Reviews ({reviews.length})</h2>
                {isAuthenticated && (
                    <button className="btn btn-primary btn-sm" onClick={() => setReviewModal(true)}>+ Write Review</button>
                )}
            </div>
            {reviews.length === 0 ? (
                <p style={{ color: 'var(--text3)' }}>No reviews yet. Be the first!</p>
            ) : (
                reviews.map(r => <ReviewCard key={r.id} review={r} onLike={handleLike} currentUserId={user?.id} onDelete={handleDeleteReview} />)
            )}

            {/* Review Modal */}
            <Modal open={reviewModal} onClose={() => { setReviewModal(false); setReviewError(''); }} title="Write a Review">
                {reviewError && <Alert type="error">{reviewError}</Alert>}
                <div className="form-group">
                    <label className="label">Your Rating *</label>
                    <Stars rating={reviewForm.rating} interactive size={28} onRate={r => setReviewForm(p => ({ ...p, rating: r }))} />
                </div>
                <div className="form-group">
                    <label className="label">Your thoughts (optional)</label>
                    <textarea className="input" rows={4} style={{ resize: 'vertical' }} placeholder="What did you think of this book?" value={reviewForm.body} onChange={e => setReviewForm(p => ({ ...p, body: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setReviewModal(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleReview}>Submit Review</button>
                </div>
            </Modal>

            {/* Progress Modal */}
            <Modal open={progressModal} onClose={() => setProgressModal(false)} title="Update Reading Progress" maxWidth={360}>
                <div className="form-group">
                    <label className="label">Current page {book.pageCount ? `(of ${book.pageCount})` : ''}</label>
                    <input className="input" type="number" min={0} max={book.pageCount} value={progressInput} onChange={e => setProgressInput(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setProgressModal(false)}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={handleProgressUpdate}>Save</button>
                </div>
            </Modal>
        </div>
    );
}