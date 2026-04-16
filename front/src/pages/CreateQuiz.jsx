import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, BookOpen, ChevronDown, X } from 'lucide-react';
import { quizService } from '../services/quizDiscussionService';
import api from '../api/axios';

export default function CreateQuiz({ onCreated, toast }) {
    const [books, setBooks] = useState([]);
    const [loadingBooks, setLoadingBooks] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [selectedBookId, setSelectedBookId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: [{ optionText: '', correct: false }, { optionText: '', correct: false }] }
    ]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch user's "Read" shelf books
        api.get('/shelves').then(async (r) => {
            const shelves = r.data;
            const readShelf = shelves.find(s => s.name === 'Read');
            if (readShelf) {
                const booksRes = await api.get(`/shelves/${readShelf.id}/books`);
                setBooks(booksRes.data.map(sb => sb.book));
            }
        }).catch(() => setBooks([])).finally(() => setLoadingBooks(false));
    }, []);

    const validate = () => {
        const errs = {};
        if (!selectedBookId) errs.book = 'Please select a book';
        if (!title.trim()) errs.title = 'Title is required';
        questions.forEach((q, i) => {
            if (!q.questionText.trim()) errs[`q_${i}`] = 'Question text required';
            const hasCorrect = q.options.some(o => o.correct);
            if (!hasCorrect) errs[`q_${i}_correct`] = 'Mark at least one correct answer';
            q.options.forEach((o, j) => {
                if (!o.optionText.trim()) errs[`q_${i}_o_${j}`] = 'Option text required';
            });
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            const payload = {
                bookId: Number(selectedBookId),
                title,
                description,
                questions: questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options.map(o => ({
                        optionText: o.optionText,
                        correct: o.correct,
                    })),
                })),
            };
            const created = await quizService.create(payload);
            toast?.show('Quiz published!', 'success');
            onCreated?.(created);
        } catch (e) {
            toast?.show(e.response?.data?.message || 'Failed to create quiz', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const addQuestion = () => setQuestions([...questions, {
        questionText: '',
        options: [{ optionText: '', correct: false }, { optionText: '', correct: false }]
    }]);

    const removeQuestion = (qi) => setQuestions(questions.filter((_, i) => i !== qi));

    const updateQuestion = (qi, text) => {
        const q = [...questions];
        q[qi] = { ...q[qi], questionText: text };
        setQuestions(q);
    };

    const addOption = (qi) => {
        const q = [...questions];
        if (q[qi].options.length >= 6) return;
        q[qi].options = [...q[qi].options, { optionText: '', correct: false }];
        setQuestions(q);
    };

    const removeOption = (qi, oi) => {
        const q = [...questions];
        if (q[qi].options.length <= 2) return;
        q[qi].options = q[qi].options.filter((_, i) => i !== oi);
        setQuestions(q);
    };

    const updateOption = (qi, oi, text) => {
        const q = [...questions];
        q[qi].options[oi].optionText = text;
        setQuestions(q);
    };

    const toggleCorrect = (qi, oi) => {
        const q = [...questions];
        q[qi].options[oi].correct = !q[qi].options[oi].correct;
        setQuestions(q);
    };

    if (loadingBooks) {
        return (
            <div className="loading-center">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header">
                <h1>Create a Quiz</h1>
                <p>Challenge other readers to test their knowledge of a book you've finished.</p>
            </div>

            {books.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                    <BookOpen size={40} style={{ color: 'var(--text3)', marginBottom: 16 }} />
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', marginBottom: 8 }}>No finished books yet</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
                        Move books to your <strong>Read</strong> shelf to create quizzes about them.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Meta */}
                    <div className="card">
                        <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', marginBottom: 16, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Quiz Details</h3>

                        <div className="form-group">
                            <label className="label">Book *</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    className="select"
                                    value={selectedBookId}
                                    onChange={e => setSelectedBookId(e.target.value)}
                                >
                                    <option value="">Choose a book you've read…</option>
                                    {books.map(b => (
                                        <option key={b.id} value={b.id}>{b.title}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.book && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.book}</p>}
                        </div>

                        <div className="form-group">
                            <label className="label">Quiz Title *</label>
                            <input
                                className="input"
                                placeholder="e.g. Test your knowledge of The Great Gatsby"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                            {errors.title && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors.title}</p>}
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="label">Description (optional)</label>
                            <textarea
                                className="input"
                                rows={2}
                                placeholder="Give readers a brief overview of what this quiz covers…"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    {questions.map((q, qi) => (
                        <div key={qi} className="card" style={{ position: 'relative' }}>
                            {/* Question header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                                    Question {qi + 1}
                                </span>
                                {questions.length > 1 && (
                                    <button className="btn btn-ghost btn-icon" onClick={() => removeQuestion(qi)} title="Remove question">
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="label">Question *</label>
                                <textarea
                                    className="input"
                                    rows={2}
                                    placeholder="What is the name of…?"
                                    value={q.questionText}
                                    onChange={e => updateQuestion(qi, e.target.value)}
                                    style={{ resize: 'vertical' }}
                                />
                                {errors[`q_${qi}`] && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>{errors[`q_${qi}`]}</p>}
                                {errors[`q_${qi}_correct`] && (
                                    <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AlertCircle size={13} /> {errors[`q_${qi}_correct`]}
                                    </p>
                                )}
                            </div>

                            <label className="label" style={{ marginBottom: 10 }}>Answer Options * <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(tick the correct one/s)</span></label>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {q.options.map((o, oi) => (
                                    <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        {/* Correct toggle */}
                                        <button
                                            onClick={() => toggleCorrect(qi, oi)}
                                            style={{
                                                width: 28, height: 28, borderRadius: '50%', border: '2px solid',
                                                borderColor: o.correct ? 'var(--green)' : 'var(--border2)',
                                                background: o.correct ? 'rgba(123,198,126,0.15)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0, transition: 'all 0.15s', cursor: 'pointer',
                                            }}
                                            title={o.correct ? 'Mark as incorrect' : 'Mark as correct'}
                                        >
                                            {o.correct && <CheckCircle2 size={14} color="var(--green)" />}
                                        </button>

                                        <input
                                            className="input"
                                            style={{ flex: 1 }}
                                            placeholder={`Option ${oi + 1}`}
                                            value={o.optionText}
                                            onChange={e => updateOption(qi, oi, e.target.value)}
                                        />

                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => removeOption(qi, oi)}
                                            disabled={q.options.length <= 2}
                                            style={{ flexShrink: 0, opacity: q.options.length <= 2 ? 0.3 : 1 }}
                                        >
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {q.options.length < 6 && (
                                <button
                                    className="btn btn-ghost btn-sm"
                                    style={{ marginTop: 12, color: 'var(--blue)' }}
                                    onClick={() => addOption(qi)}
                                >
                                    <Plus size={14} /> Add option
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={addQuestion}>
                            <Plus size={16} /> Add Question
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? 'Publishing…' : 'Publish Quiz'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
