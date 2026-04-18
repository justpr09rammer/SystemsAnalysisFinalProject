import { useState, useEffect } from 'react';
import { socialService, reviewService } from '../services/api';
import { LoadingCenter, EmptyState, Stars } from '../components/UI';

export default function FeedPage({ onBookSelect }) {
    const [feed, setFeed] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('feed');

    useEffect(() => {
        Promise.all([
            socialService.getFeed(0),
            reviewService.getMyReviews(0)
        ]).then(([f, r]) => {
            setFeed(f.data?.content || []);
            setMyReviews(r.data?.content || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <LoadingCenter />;

    return (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="page-header">
                <h1>Social</h1>
                <p>See what fellow readers are up to</p>
            </div>

            <div className="tabs">
                {[{id:'feed',label:'Activity Feed'},{id:'reviews',label:'My Reviews'}].map(t => (
                    <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>
                ))}
            </div>

            {tab === 'feed' && (
                feed.length === 0 ? (
                    <EmptyState icon="👥" title="No activity yet" description="Follow other readers to see their activity here" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {feed.map((item, i) => (
                            <div key={i} className="card" style={{ cursor: 'pointer' }} onClick={() => item.bookId && onBookSelect(item.bookId)}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface2)', display: 'grid', placeItems: 'center', fontWeight: 600, flexShrink: 0 }}>
                                        {item.actorUsername?.[0]?.toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.9rem', marginBottom: 4 }}>
                                            <span style={{ fontWeight: 600 }}>{item.actorUsername}</span>
                                            {' '}reviewed{' '}
                                            <span style={{ color: 'var(--accent)' }}>{item.bookTitle}</span>
                                        </div>
                                        {item.detail && <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{item.detail}</div>}
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4 }}>
                                            {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {tab === 'reviews' && (
                myReviews.length === 0 ? (
                    <EmptyState icon="✍️" title="No reviews yet" description="Find a book and share your thoughts!" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {myReviews.map(r => (
                            <div key={r.id} className="card" style={{ cursor: 'pointer' }} onClick={() => onBookSelect(r.bookId)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{r.bookTitle}</span>
                                    <Stars rating={r.rating} size={14} />
                                </div>
                                {r.body && <p style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>{r.body}</p>}
                                <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 8 }}>
                                    {new Date(r.createdAt).toLocaleDateString()} · {r.likesCount} likes
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}