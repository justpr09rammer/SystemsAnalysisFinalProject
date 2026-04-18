import { useState, useEffect } from 'react';
import { shelfService } from '../services/api';
import { BookCover, LoadingCenter, EmptyState } from '../components/UI';

export default function LibraryPage({ onBookSelect, toast }) {
    const [shelves, setShelves] = useState([]);
    const [activeSelf, setActiveShelf] = useState(null);
    const [shelfBooks, setShelfBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [newShelfName, setNewShelfName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        shelfService.getMyShelves()
            .then(r => { setShelves(r.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const openShelf = async (shelf) => {
        setActiveShelf(shelf);
        setLoadingBooks(true);
        try {
            const r = await shelfService.getBooks(shelf.id);
            setShelfBooks(r.data || []);
        } catch { setShelfBooks([]); }
        setLoadingBooks(false);
    };

    const createShelf = async () => {
        if (!newShelfName.trim()) return;
        setCreating(true);
        try {
            await shelfService.create({ name: newShelfName });
            const r = await shelfService.getMyShelves();
            setShelves(r.data || []);
            setNewShelfName('');
            toast?.success('Shelf created!');
        } catch (e) { toast?.error(e.response?.data?.message || 'Failed to create shelf'); }
        setCreating(false);
    };

    const deleteShelf = async (id) => {
        try {
            await shelfService.delete(id);
            setShelves(prev => prev.filter(s => s.id !== id));
            if (activeSelf?.id === id) setActiveShelf(null);
            toast?.success('Shelf deleted');
        } catch (e) { toast?.error(e.response?.data?.message || 'Cannot delete this shelf'); }
    };

    const removeBookFromShelf = async (bookId) => {
        try {
            await shelfService.removeBook(activeSelf.id, bookId);
            setShelfBooks(prev => prev.filter(sb => sb.book.id !== bookId));
            toast?.success('Book removed');
        } catch { toast?.error('Failed to remove book'); }
    };

    if (loading) return <LoadingCenter />;

    const shelfIcons = { 'Want to read': '🔖', 'Currently reading': '📖', 'Read': '✅' };

    return (
        <div>
            <div className="page-header">
                <h1>My Library</h1>
                <p>Organize your reading with personal shelves</p>
            </div>

            {!activeSelf ? (
                <>
                    {/* Shelf Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
                        {shelves.map(shelf => (
                            <div key={shelf.id} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => openShelf(shelf)}>
                                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{shelfIcons[shelf.name] || '📚'}</div>
                                <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{shelf.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text3)', marginBottom: 12 }}>
                                    {shelf.shelfBooks?.length || 0} books
                                </div>
                                {!shelf.default && (
                                    <button className="btn btn-danger btn-sm" style={{ width: 'fit-content' }}
                                            onClick={e => { e.stopPropagation(); deleteShelf(shelf.id); }}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Create shelf */}
                    <div className="card" style={{ maxWidth: 400 }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Create New Shelf</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input className="input" style={{ flex: 1 }} placeholder="Shelf name..." value={newShelfName} onChange={e => setNewShelfName(e.target.value)} onKeyPress={e => e.key === 'Enter' && createShelf()} />
                            <button className="btn btn-primary" onClick={createShelf} disabled={creating || !newShelfName.trim()}>
                                {creating ? '...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <button className="btn btn-ghost" style={{ marginBottom: 24, paddingLeft: 0 }} onClick={() => setActiveShelf(null)}>
                        ← Back to Shelves
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                        <span style={{ fontSize: '2rem' }}>{shelfIcons[activeSelf.name] || '📚'}</span>
                        <div>
                            <h2 style={{ fontSize: '1.8rem' }}>{activeSelf.name}</h2>
                            <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{shelfBooks.length} books</p>
                        </div>
                    </div>

                    {loadingBooks ? <LoadingCenter /> : shelfBooks.length === 0 ? (
                        <EmptyState icon="📭" title="This shelf is empty" description="Add books from the Explore page" />
                    ) : (
                        <div className="book-grid">
                            {shelfBooks.map(sb => (
                                <div key={sb.id} style={{ position: 'relative' }}>
                                    <div style={{ cursor: 'pointer' }} onClick={() => onBookSelect(sb.book.id)}>
                                        <BookCover src={sb.book.coverImageUrl} title={sb.book.title} width="100%" height={200} />
                                        <div style={{ marginTop: 8 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>{sb.book.title}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{sb.book.authors?.map(a => a.name).join(', ')}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
                                        onClick={() => removeBookFromShelf(sb.book.id)}
                                    >Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}