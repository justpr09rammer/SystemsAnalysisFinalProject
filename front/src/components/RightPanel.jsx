import { useState, useEffect } from 'react';
import { progressService, bookService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from './UI';

export default function RightPanel({ onBookSelect }) {
    const { isAuthenticated, user } = useAuth();
    const [progress, setProgress] = useState([]);
    const [topBooks, setTopBooks] = useState([]);

    useEffect(() => {
        bookService.getTopRated(0, 3).then(r => setTopBooks(r.data?.content || [])).catch(() => {});
        if (isAuthenticated) {
            progressService.getMyProgress().then(r => setProgress(r.data?.filter(p => p.currentPage > 0 && p.currentPage < (p.book?.pageCount || 0))?.slice(0, 2) || [])).catch(() => {});
        }
    }, [isAuthenticated]);

    return (
        <>
            {/* Currently reading */}
            {isAuthenticated && progress.length > 0 && (
                <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>
                        Currently Reading
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {progress.map(p => {
                            const pct = p.book?.pageCount ? Math.round((p.currentPage / p.book.pageCount) * 100) : 0;
                            return (
                                <div key={p.id} className="card" style={{ cursor: 'pointer', padding: 14 }} onClick={() => onBookSelect(p.book.id)}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, lineHeight: 1.3 }}>{p.book.title}</div>
                                    <div style={{ marginBottom: 6 }}>
                                        <ProgressBar value={p.currentPage} max={p.book.pageCount} />
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Page {p.currentPage} · {pct}%</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Trending */}
            <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>
                    Top Rated
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {topBooks.map((book, i) => (
                        <div key={book.id} className="card" style={{ cursor: 'pointer', padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'center' }} onClick={() => onBookSelect(book.id)}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface2)', display: 'grid', placeItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', flexShrink: 0 }}>
                                #{i + 1}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                                    <span style={{ color: 'var(--gold)' }}>★</span> {Number(book.averageRating).toFixed(1)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick links */}
            {!isAuthenticated && (
                <div className="card" style={{ background: 'linear-gradient(135deg, rgba(232,169,106,0.1), rgba(212,132,92,0.05))', border: '1px solid rgba(232,169,106,0.2)' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>📚</div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Join Readify</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                        Track your reading, write reviews, and connect with other readers.
                    </div>
                </div>
            )}
        </>
    );
}