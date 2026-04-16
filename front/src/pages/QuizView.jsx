import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, RotateCcw, CheckCircle, XCircle, Clock, BookOpen, BarChart2 } from 'lucide-react';
import { quizService } from '../services/quizDiscussionService';

export default function QuizView({ quizId, onBack, toast }) {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [phase, setPhase] = useState('intro'); // intro | taking | submitted
    const [selected, setSelected] = useState({}); // questionId -> optionId
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [pastAttempts, setPastAttempts] = useState([]);

    useEffect(() => {
        Promise.all([
            quizService.getById(quizId),
            quizService.getAttemptsForQuiz(quizId).catch(() => []),
        ]).then(([q, attempts]) => {
            setQuiz(q);
            setPastAttempts(attempts);
        }).catch(() => toast?.show('Failed to load quiz', 'error'))
          .finally(() => setLoading(false));
    }, [quizId]);

    const handleSelect = (questionId, optionId) => {
        if (phase !== 'taking') return;
        setSelected(prev => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        const answered = Object.keys(selected).length;
        if (answered < quiz.questions.length) {
            toast?.show(`Please answer all ${quiz.questions.length} questions`, 'info');
            return;
        }
        setSubmitting(true);
        try {
            const res = await quizService.submit(quizId, selected);
            setResult(res);
            setPhase('submitted');
            const attempts = await quizService.getAttemptsForQuiz(quizId).catch(() => []);
            setPastAttempts(attempts);
        } catch (e) {
            toast?.show('Submission failed', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRetry = () => {
        setSelected({});
        setResult(null);
        setPhase('taking');
    };

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;
    if (!quiz) return <div className="empty-state"><p>Quiz not found.</p></div>;

    const bestScore = pastAttempts.length > 0
        ? Math.max(...pastAttempts.map(a => a.score))
        : null;

    // ---- INTRO ----
    if (phase === 'intro') {
        return (
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
                <button className="btn btn-ghost" style={{ marginBottom: 24, paddingLeft: 0 }} onClick={onBack}>
                    <ArrowLeft size={16} /> Back to Quizzes
                </button>

                <div className="card" style={{ padding: 32 }}>
                    {/* Book info */}
                    <div style={{ display: 'flex', gap: 20, marginBottom: 28, alignItems: 'flex-start' }}>
                        {quiz.bookCoverUrl
                            ? <img src={quiz.bookCoverUrl} alt={quiz.bookTitle}
                                style={{ width: 72, height: 108, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            : <div className="book-cover-placeholder" style={{ width: 72, height: 108, flexShrink: 0 }}>📚</div>
                        }
                        <div>
                            <div className="badge badge-amber" style={{ marginBottom: 8 }}>
                                {quiz.quizType === 'VERIFIED' ? '✓ Verified' : 'Community'}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{quiz.title}</h2>
                            <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: 4 }}>
                                {quiz.bookTitle}
                            </p>
                            <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                                by {quiz.creatorUsername}
                            </p>
                        </div>
                    </div>

                    {quiz.description && (
                        <p style={{ color: 'var(--text2)', marginBottom: 24, lineHeight: 1.7 }}>{quiz.description}</p>
                    )}

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
                        <Stat icon={<BookOpen size={16} />} label="Questions" value={quiz.questionCount} />
                        <Stat icon={<BarChart2 size={16} />} label="Attempts" value={quiz.attemptCount} />
                        {bestScore !== null && (
                            <Stat icon={<Trophy size={16} color="var(--gold)" />}
                                label="Your best"
                                value={`${bestScore}/${quiz.questionCount}`}
                            />
                        )}
                    </div>

                    {/* Past attempts */}
                    {pastAttempts.length > 0 && (
                        <div style={{ marginBottom: 24, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                Your Attempts
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {pastAttempts.slice(0, 5).map((a, i) => (
                                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                                        <span style={{ color: 'var(--text2)' }}>Attempt #{i + 1}</span>
                                        <span style={{
                                            color: a.score / a.totalQuestions >= 0.7 ? 'var(--green)' : 'var(--text2)',
                                            fontWeight: 600,
                                        }}>
                                            {a.score}/{a.totalQuestions} ({Math.round(a.score * 100 / a.totalQuestions)}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="btn btn-primary" style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '1rem' }}
                        onClick={() => setPhase('taking')}>
                        {pastAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                </div>
            </div>
        );
    }

    // ---- TAKING ----
    if (phase === 'taking') {
        const answeredCount = Object.keys(selected).length;
        const progress = (answeredCount / quiz.questions.length) * 100;

        return (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                {/* Progress bar header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <button className="btn btn-ghost" style={{ paddingLeft: 0 }} onClick={onBack}>
                            <ArrowLeft size={16} /> Exit
                        </button>
                        <span style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>
                            {answeredCount} / {quiz.questions.length} answered
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {quiz.questions.map((q, qi) => {
                        const answered = selected[q.id];
                        return (
                            <div key={q.id} className="card" style={{
                                borderColor: answered ? 'var(--border2)' : 'var(--border)',
                                transition: 'border-color 0.2s',
                            }}>
                                <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 10 }}>
                                    Q{qi + 1}
                                </p>
                                <p style={{ fontSize: '1.05rem', fontWeight: 500, marginBottom: 18, lineHeight: 1.6 }}>
                                    {q.questionText}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {q.options.map(o => {
                                        const isSelected = selected[q.id] === o.id;
                                        return (
                                            <button
                                                key={o.id}
                                                onClick={() => handleSelect(q.id, o.id)}
                                                style={{
                                                    textAlign: 'left', padding: '12px 16px', borderRadius: 8,
                                                    border: `2px solid ${isSelected ? 'var(--accent)' : 'var(--border2)'}`,
                                                    background: isSelected ? 'rgba(232,169,106,0.1)' : 'var(--surface)',
                                                    color: isSelected ? 'var(--accent)' : 'var(--text)',
                                                    cursor: 'pointer', transition: 'all 0.15s', width: '100%',
                                                    fontWeight: isSelected ? 600 : 400, fontSize: '0.95rem',
                                                }}
                                            >
                                                {o.optionText}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: 28 }}>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: 14, justifyContent: 'center', fontSize: '1rem' }}
                        onClick={handleSubmit}
                        disabled={submitting || answeredCount < quiz.questions.length}
                    >
                        {submitting ? 'Submitting…' : `Submit Quiz (${answeredCount}/${quiz.questions.length})`}
                    </button>
                </div>
            </div>
        );
    }

    // ---- SUBMITTED / RESULTS ----
    if (phase === 'submitted' && result) {
        const pct = result.scorePercent;
        const grade = pct >= 90 ? { label: 'Excellent!', color: 'var(--green)' }
            : pct >= 70 ? { label: 'Good job!', color: 'var(--blue)' }
            : pct >= 50 ? { label: 'Not bad', color: 'var(--accent)' }
            : { label: 'Keep practising', color: 'var(--red)' };

        return (
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                {/* Score card */}
                <div className="card" style={{ padding: '36px 32px', textAlign: 'center', marginBottom: 24 }}>
                    <Trophy size={48} color="var(--gold)" style={{ marginBottom: 16 }} />
                    <h2 style={{ fontSize: '2.5rem', marginBottom: 4 }}>{result.score}/{result.totalQuestions}</h2>
                    <p style={{ color: grade.color, fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>
                        {grade.label}
                    </p>
                    <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
                        Score: {pct}%
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                        <button className="btn btn-secondary" onClick={handleRetry}>
                            <RotateCcw size={15} /> Retake
                        </button>
                        <button className="btn btn-primary" onClick={onBack}>
                            Back to Quizzes
                        </button>
                    </div>
                </div>

                {/* Per-question review */}
                <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Review
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {quiz.questions.map((q, qi) => {
                        const wasCorrect = result.questionResults[q.id];
                        const correctOptId = result.correctOptions[q.id];
                        const selectedOptId = selected[q.id];

                        return (
                            <div key={q.id} className="card" style={{
                                borderLeft: `3px solid ${wasCorrect ? 'var(--green)' : 'var(--red)'}`,
                            }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                                    {wasCorrect
                                        ? <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                                        : <XCircle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    }
                                    <p style={{ fontWeight: 500, lineHeight: 1.6 }}>Q{qi + 1}: {q.questionText}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 28 }}>
                                    {q.options.map(o => {
                                        const isCorrectOpt = o.id === correctOptId;
                                        const isSelectedOpt = o.id === selectedOptId;
                                        let bg = 'transparent', color = 'var(--text2)', borderColor = 'transparent';
                                        if (isCorrectOpt) { bg = 'rgba(123,198,126,0.12)'; color = 'var(--green)'; borderColor = 'var(--green)'; }
                                        else if (isSelectedOpt && !wasCorrect) { bg = 'rgba(240,128,128,0.1)'; color = 'var(--red)'; borderColor = 'var(--red)'; }
                                        return (
                                            <div key={o.id} style={{
                                                padding: '8px 12px', borderRadius: 6,
                                                border: `1px solid ${borderColor || 'var(--border)'}`,
                                                background: bg, color, fontSize: '0.9rem',
                                                display: 'flex', alignItems: 'center', gap: 8,
                                            }}>
                                                {isCorrectOpt && <CheckCircle size={13} />}
                                                {isSelectedOpt && !wasCorrect && <XCircle size={13} />}
                                                {o.optionText}
                                                {isSelectedOpt && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', opacity: 0.7 }}>Your answer</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}

function Stat({ icon, label, value }) {
    return (
        <div style={{ flex: 1, padding: '12px', background: 'var(--surface)', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4, color: 'var(--text2)' }}>{icon}</div>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{label}</p>
        </div>
    );
}
