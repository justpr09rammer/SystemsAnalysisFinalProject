import { useState, useEffect, useCallback } from 'react';
import { HelpCircle, PlusCircle, Trophy, BookOpen, BarChart2, User } from 'lucide-react';
import { quizService } from '../services/quizDiscussionService';
import QuizView from '../components/QuizView';
import CreateQuiz from '../components/CreateQuiz';

export default function QuizzesPage({ toast }) {
    const [tab, setTab] = useState('browse'); // browse | create | view
    const [activeQuizId, setActiveQuizId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchQuizzes = useCallback(async (p = 0) => {
        setLoading(true);
        try {
            const data = await quizService.getAll(p);
            setQuizzes(p === 0 ? data.content : prev => [...prev, ...data.content]);
            setTotalPages(data.totalPages);
            setPage(p);
        } catch {
            toast?.show('Failed to load quizzes', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchQuizzes(0); }, []);

    const handleStart = (quizId) => {
        setActiveQuizId(quizId);
        setTab('view');
    };

    const handleCreated = () => {
        setTab('browse');
        fetchQuizzes(0);
        toast?.show('Quiz published successfully!', 'success');
    };

    if (tab === 'view' && activeQuizId) {
        return <QuizView quizId={activeQuizId} onBack={() => { setTab('browse'); setActiveQuizId(null); }} toast={toast} />;
    }

    if (tab === 'create') {
        return <CreateQuiz onCreated={handleCreated} toast={toast} />;
    }

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
                <div className="page-header" style={{ marginBottom: 0 }}>
                    <h1>Quizzes</h1>
                    <p>Test your knowledge of the books you've read.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setTab('create')}>
                    <PlusCircle size={16} /> Create Quiz
                </button>
            </div>

            {loading && quizzes.length === 0 ? (
                <div className="loading-center"><div className="spinner" /></div>
            ) : quizzes.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🧩</div>
                    <h3>No quizzes yet</h3>
                    <p>Be the first to create one!</p>
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 20,
                    }}>
                        {quizzes.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} onStart={handleStart} />
                        ))}
                    </div>

                    {page < totalPages - 1 && (
                        <div style={{ textAlign: 'center', marginTop: 28 }}>
                            <button className="btn btn-secondary" onClick={() => fetchQuizzes(page + 1)} disabled={loading}>
                                {loading ? 'Loading…' : 'Load more'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function QuizCard({ quiz, onStart }) {
    const pct = quiz.userBestScore != null
        ? Math.round((quiz.userBestScore / quiz.questionCount) * 100)
        : null;

    return (
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Book + badge */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'flex-start' }}>
                {quiz.bookCoverUrl
                    ? <img src={quiz.bookCoverUrl} alt={quiz.bookTitle}
                        style={{ width: 52, height: 78, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                    : <div className="book-cover-placeholder" style={{ width: 52, height: 78, flexShrink: 0, fontSize: '1.4rem' }}>📚</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={`badge ${quiz.quizType === 'VERIFIED' ? 'badge-green' : 'badge-blue'}`} style={{ marginBottom: 6 }}>
                        {quiz.quizType === 'VERIFIED' ? '✓ Verified' : 'Community'}
                    </div>
                    <h3 style={{
                        fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', fontWeight: 600,
                        marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                        {quiz.title}
                    </h3>
                    <p style={{ color: 'var(--text3)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {quiz.bookTitle}
                    </p>
                </div>
            </div>

            {quiz.description && (
                <p style={{
                    color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 14,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                    {quiz.description}
                </p>
            )}

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: '0.82rem' }}>
                    <HelpCircle size={13} /> {quiz.questionCount} Q
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: '0.82rem' }}>
                    <BarChart2 size={13} /> {quiz.attemptCount} attempts
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text3)', fontSize: '0.82rem' }}>
                    <User size={13} /> {quiz.creatorUsername}
                </div>
            </div>

            {/* User best score */}
            {pct !== null && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 5 }}>
                        <span>Your best</span>
                        <span style={{ color: pct >= 70 ? 'var(--green)' : 'var(--accent)', fontWeight: 600 }}>
                            {quiz.userBestScore}/{quiz.questionCount} ({pct}%)
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{
                            width: `${pct}%`,
                            background: pct >= 70 ? 'var(--green)' : 'var(--accent)',
                        }} />
                    </div>
                </div>
            )}

            <button className="btn btn-primary btn-sm" style={{ justifyContent: 'center', marginTop: 'auto' }}
                onClick={() => onStart(quiz.id)}>
                {quiz.userAttemptCount > 0 ? 'Retake' : 'Start Quiz'}
            </button>
        </div>
    );
}
