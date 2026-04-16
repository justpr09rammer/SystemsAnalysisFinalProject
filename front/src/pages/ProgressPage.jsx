import { useState, useEffect } from 'react';
import { progressService } from '../services/api';
import { BookCover, LoadingCenter, EmptyState, ProgressBar } from '../components/UI';

export default function ProgressPage({ onBookSelect, toast }) {
    const [progressList, setProgressList] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [challengeForm, setChallengeForm] = useState({ year: new Date().getFullYear(), goalBooks: 12 });
    const [showChallengeForm, setShowChallengeForm] = useState(false);

    useEffect(() => {
        Promise.all([
            progressService.getMyProgress(),
            progressService.getMyChallenges()
        ]).then(([p, c]) => {
            setProgressList(p.data || []);
            setChallenges(c.data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const saveChallenge = async () => {
        try {
            await progressService.createOrUpdateChallenge(challengeForm);
            const r = await progressService.getMyChallenges();
            setChallenges(r.data || []);
            setShowChallengeForm(false);
            toast?.success('Reading challenge saved!');
        } catch (e) { toast?.error('Failed to save challenge'); }
    };

    const syncChallenge = async (year) => {
        try {
            await progressService.syncChallenge(year);
            const r = await progressService.getMyChallenges();
            setChallenges(r.data || []);
            toast?.success('Challenge synced!');
        } catch { toast?.error('Failed to sync'); }
    };

    if (loading) return <LoadingCenter />;

    const inProgress = progressList.filter(p => p.currentPage > 0 && p.currentPage < (p.book?.pageCount || 0));
    const completed = progressList.filter(p => p.finishDate || (p.currentPage >= (p.book?.pageCount || 1)));

    return (
        <div>
            <div className="page-header">
                <h1>Reading Progress</h1>
                <p>Track your reading journey</p>
            </div>

            {/* Reading Challenges */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 className="section-title" style={{ margin: 0 }}>Reading Challenges</h2>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowChallengeForm(true)}>+ New Challenge</button>
                </div>

                {showChallengeForm && (
                    <div className="card" style={{ marginBottom: 16, maxWidth: 400 }}>
                        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', marginBottom: 16 }}>Set Reading Challenge</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                            <div>
                                <label className="label">Year</label>
                                <input className="input" type="number" value={challengeForm.year} onChange={e => setChallengeForm(p => ({ ...p, year: parseInt(e.target.value) }))} />
                            </div>
                            <div>
                                <label className="label">Goal (books)</label>
                                <input className="input" type="number" min="1" value={challengeForm.goalBooks} onChange={e => setChallengeForm(p => ({ ...p, goalBooks: parseInt(e.target.value) }))} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-primary btn-sm" onClick={saveChallenge}>Save Challenge</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowChallengeForm(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {challenges.length === 0 ? (
                    <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>No challenges yet. Set a reading goal!</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {challenges.map(c => {
                            const pct = c.goalBooks > 0 ? Math.min(100, Math.round(((c.booksRead || 0) / c.goalBooks) * 100)) : 0;
                            return (
                                <div key={c.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{c.year} Challenge</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{c.booksRead || 0} / {c.goalBooks} books</div>
                                        </div>
                                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: pct >= 100 ? 'var(--green)' : 'var(--accent)' }}>{pct}%</div>
                                    </div>
                                    <ProgressBar value={c.booksRead || 0} max={c.goalBooks} />
                                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => syncChallenge(c.year)}>Sync</button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Currently Reading */}
            <div style={{ marginBottom: 32 }}>
                <h2 className="section-title">Currently Reading ({inProgress.length})</h2>
                {inProgress.length === 0 ? (
                    <p style={{ color: 'var(--text3)', fontSize: '0.9rem' }}>Not reading anything right now.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {inProgress.map(p => {
                            const pct = p.book?.pageCount ? Math.round((p.currentPage / p.book.pageCount) * 100) : 0;
                            return (
                                <div key={p.id} className="card" style={{ display: 'flex', gap: 16, cursor: 'pointer' }} onClick={() => onBookSelect(p.book.id)}>
                                    <BookCover src={p.book.coverImageUrl} title={p.book.title} width={60} height={90} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.book.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 12 }}>
                                            Page {p.currentPage} of {p.book.pageCount} · {pct}%
                                        </div>
                                        <ProgressBar value={p.currentPage} max={p.book.pageCount} />
                                        {p.startDate && <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 6 }}>Started: {new Date(p.startDate).toLocaleDateString()}</div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Completed */}
            {completed.length > 0 && (
                <div>
                    <h2 className="section-title">Completed ({completed.length})</h2>
                    <div className="book-grid">
                        {completed.map(p => (
                            <div key={p.id} style={{ cursor: 'pointer' }} onClick={() => onBookSelect(p.book.id)}>
                                <BookCover src={p.book.coverImageUrl} title={p.book.title} width="100%" height={180} />
                                <div style={{ marginTop: 8 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>{p.book.title}</div>
                                    {p.finishDate && <div style={{ fontSize: '0.78rem', color: 'var(--green)' }}>✅ {new Date(p.finishDate).toLocaleDateString()}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}