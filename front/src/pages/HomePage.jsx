import { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import { BookCover, LoadingCenter, EmptyState } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { Stars } from '../components/UI';

function BookCard({ book, onClick }) {
    return (
        <div className="card card-hover" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }} onClick={onClick}>
            <div style={{ position: 'relative' }}>
                <BookCover src={book.coverImageUrl} title={book.title} width="100%" height={220} />
                {book.averageRating > 0 && (
                    <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--gold)' }}>★</span>
                        <span>{Number(book.averageRating).toFixed(1)}</span>
                    </div>
                )}
            </div>
            <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{book.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{book.authors?.map(a => a.name).join(', ')}</div>
            </div>
        </div>
    );
}

export default function HomePage({ onNavigate, onBookSelect }) {
    const { isAuthenticated, user } = useAuth();
    const [topBooks, setTopBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQ, setSearchQ] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        bookService.getTopRated(0, 12).then(r => { setTopBooks(r.data?.content || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQ.trim()) { setSearchResults(null); return; }
        setSearching(true);
        try {
            const r = await bookService.search(searchQ);
            setSearchResults(Array.isArray(r.data) ? r.data : r.data?.content || []);
        } catch {}
        setSearching(false);
    };

    const displayBooks = searchResults || topBooks;

    return (
        <div>
            {/* Hero */}
            <div style={{ marginBottom: 40, padding: '40px', background: 'linear-gradient(135deg, var(--bg2) 0%, var(--surface) 100%)', borderRadius: 16, border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(232,169,106,0.1), transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.85rem', color: 'var(--accent)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>Welcome to Readify</div>
                <h1 style={{ fontSize: '2.8rem', marginBottom: 12, lineHeight: 1.15 }}>
                    {isAuthenticated ? `Hello, ${user?.name || user?.username} 👋` : 'Your Reading Journey Starts Here'}
                </h1>
                <p style={{ color: 'var(--text2)', maxWidth: 500, marginBottom: 28, fontSize: '1rem' }}>
                    {isAuthenticated ? 'Discover new books, track your reading progress, and connect with fellow readers.' : 'Track your reading, discover new books, and share your thoughts with a community of readers.'}
                </p>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, maxWidth: 520 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input className="input" style={{ paddingLeft: 44 }} placeholder="Search books, authors..." value={searchQ} onChange={e => { setSearchQ(e.target.value); if (!e.target.value) setSearchResults(null); }} />
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={searching}>
                        {searching ? '...' : 'Search'}
                    </button>
                    {searchResults && <button type="button" className="btn btn-ghost" onClick={() => { setSearchResults(null); setSearchQ(''); }}>Clear</button>}
                </form>
            </div>

            {/* Books Grid */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 className="section-title" style={{ margin: 0 }}>
                        {searchResults ? `Results for "${searchQ}"` : 'Top Rated Books'}
                    </h2>
                    {!searchResults && <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('explore')}>View all →</button>}
                </div>

                {loading ? <LoadingCenter /> : displayBooks.length === 0 ? (
                    <EmptyState icon="🔍" title="No books found" description="Try a different search term" />
                ) : (
                    <div className="book-grid">
                        {displayBooks.slice(0, 24).map(book => (
                            <BookCard key={book.id} book={book} onClick={() => onBookSelect(book.id)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}