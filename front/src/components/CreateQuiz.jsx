import React, { useState } from 'react';
import { Plus, Trash2, X, CheckCircle2, HelpCircle } from 'lucide-react';

const CreateQuiz = ({ books, onCreated }) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [questions, setQuestions] = useState([
    { q: '', options: ['', '', ''], correct: 0 }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { q: '', options: ['', '', ''], correct: 0 }]);
  };

  const removeQuestion = (qIdx) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== qIdx));
    }
  };

  const addOption = (qIdx) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (qIdx, oIdx) => {
    const newQuestions = [...questions];
    if (newQuestions[qIdx].options.length > 2) {
      newQuestions[qIdx].options.splice(oIdx, 1);
      if (newQuestions[qIdx].correct >= newQuestions[qIdx].options.length) {
        newQuestions[qIdx].correct = 0;
      }
      setQuestions(newQuestions);
    }
  };

  const handleSave = () => {
    if (!selectedBookId) return alert("Please select a book first.");
    
    const isIncomplete = questions.some(q => 
      !q.q.trim() || q.options.some(opt => !opt.trim())
    );
    
    if (isIncomplete) return alert("Please fill in all questions and options.");
    
    // FULL IMPLEMENTATION OF UNIQUE ID LOGIC
    // Assigning a unique ID using timestamp allows multiple quizzes for the same bookId
    onCreated({ 
      id: `custom-${Date.now()}`, 
      bookId: parseInt(selectedBookId), 
      questions: [...questions] 
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#1a1c1e' }}>Create Quiz</h1>
        <p style={{ color: '#64748b' }}>Design a challenge for other readers to test their knowledge.</p>
      </header>

      {books.length === 0 ? (
        <div style={{ 
          padding: '32px', 
          background: '#f8fafc', 
          borderRadius: '16px', 
          border: '1px dashed #cbd5e1', 
          textAlign: 'center' 
        }}>
          <HelpCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#1a1c1e', marginBottom: '8px' }}>No eligible books found</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
            To create a quiz, you must first finish a book (100% progress) and add it to your 
            <strong style={{ color: '#1a1c1e' }}> Favorites</strong> shelf.
          </p>
        </div>
      ) : (
        <>
          {/* BOOK SELECTION */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#1a1c1e' }}>
              Target Book
            </label>
            <select 
              onChange={(e) => setSelectedBookId(e.target.value)} 
              value={selectedBookId}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', outline: 'none', fontSize: '1rem' }}
            >
              <option value="">Choose a book to quiz on...</option>
              {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>

          {/* QUESTIONS LIST */}
          {questions.map((q, qIdx) => (
            <div key={qIdx} style={{ background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#3498db', letterSpacing: '0.5px' }}>
                  Question {qIdx + 1}
                </span>
                {questions.length > 1 && (
                  <Trash2 size={18} onClick={() => removeQuestion(qIdx)} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                )}
              </div>

              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Question Text</label>
              <textarea 
                placeholder="e.g., What was the name of the secret society?" 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} 
                value={q.q}
                onChange={(e) => {
                  const n = [...questions]; n[qIdx].q = e.target.value; setQuestions(n);
                }}
              />
              
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '500' }}>Answers (Mark the correct one)</label>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div 
                    onClick={() => { const n = [...questions]; n[qIdx].correct = oIdx; setQuestions(n); }}
                    style={{ cursor: 'pointer', color: q.correct === oIdx ? '#2ecc71' : '#cbd5e1' }}
                  >
                    <CheckCircle2 size={24} fill={q.correct === oIdx ? '#2ecc71' : 'transparent'} color={q.correct === oIdx ? '#fff' : 'currentColor'} />
                  </div>
                  <input 
                    placeholder={`Option ${oIdx + 1}`}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} 
                    value={opt} 
                    onChange={(e) => {
                      const n = [...questions]; n[qIdx].options[oIdx] = e.target.value; setQuestions(n);
                    }}
                  />
                  <X size={18} onClick={() => removeOption(qIdx, oIdx)} style={{ cursor: 'pointer', color: '#ef4444', opacity: q.options.length > 2 ? 1 : 0.3 }} />
                </div>
              ))}
              
              <button 
                onClick={() => addOption(qIdx)} 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '8px', background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontWeight: '600', padding: 0 }}
              >
                <Plus size={16} /> Add alternative answer
              </button>
            </div>
          ))}

          {/* FOOTER ACTIONS */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
            <button 
              onClick={addQuestion} 
              style={{ flex: 1, padding: '14px', background: 'white', color: '#1a1c1e', borderRadius: '8px', border: '1px solid #1a1c1e', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Add Another Question
            </button>
            <button 
              onClick={handleSave} 
              style={{ flex: 1, padding: '14px', background: '#1a1c1e', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Publish Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateQuiz;