import { useState, useEffect } from 'react';
import { bookService, genreService } from '../services/api';
import { BookCover, LoadingCenter, EmptyState } from '../components/UI';

export default function ExplorePage({ onBookSelect }) {
    const [books, setBooks] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [activeGenre, setActiveGenre] = useState(null);
    const [sortBy, setSortBy] = useState('averageRating');

    useEffect(() => {
        genreService.getAll().then(r => setGenres(r.data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const load = activeGenre
            ? bookService.getByGenre(activeGenre, page)
            : bookService.getAll(page, 24, sortBy, 'desc');
        load.then(r => {
            setBooks(r.data?.content || r.data || []);
            setTotalPages(r.data?.totalPages || 1);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [page, activeGenre, sortBy]);

    return (
        <div>
            <div className="page-header">
                <h1>Explore Books</h1>
                <p>Discover your next great read</p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <select className="select" style={{ width: 'auto' }} value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(0); setActiveGenre(null); }}>
                    <option value="averageRating">Top Rated</option>
                    <option value="ratingsCount">Most Popular</option>
                    <option value="publishedDate">Newest</option>
                    <option value="title">A-Z</option>
                </select>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className={`btn btn-sm ${!activeGenre ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveGenre(null); setPage(0); }}>
                        All
                    </button>
                    {genres.slice(0, 10).map(g => (
                        <button key={g.id} className={`btn btn-sm ${activeGenre === g.id ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setActiveGenre(g.id); setPage(0); }}>
                            {g.name}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <LoadingCenter /> : books.length === 0 ? (
                <EmptyState icon="🔍" title="No books found" />
            ) : (
                <>
                    <div className="book-grid">
                        {books.map(book => (
                            <div key={book.id} className="card card-hover" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }} onClick={() => onBookSelect(book.id)}>
                                <BookCover src={book.coverImageUrl} title={book.title} width="100%" height={210} />
                                <div style={{ padding: '12px 14px 14px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{book.title}</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>{book.authors?.map(a => a.name).join(', ')}</div>
                                    {book.averageRating > 0 && (
                                        <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ color: 'var(--gold)' }}>★</span>
                                            <span>{Number(book.averageRating).toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 32 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Prev</button>
                            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text2)', fontSize: '0.9rem' }}>
                Page {page + 1} of {totalPages}
              </span>
                            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}