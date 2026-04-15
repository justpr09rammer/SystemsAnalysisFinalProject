// import React, { useState } from 'react';
// import { Trophy, RefreshCcw, XCircle, HelpCircle } from 'lucide-react';
//
// const VERIFIED_QUIZZES = {
//   'verified-atomic': {
//     bookId: 4,
//     questions: [
//       { q: "What is the '1% Rule' mentioned in the book?", options: ["Work 1% harder than others", "Improve by 1% every day", "Spend 1% of your income on books", "Eat 1% less sugar"], correct: 1 },
//       { q: "According to Clear, what are the four laws of behavior change?", options: ["Cue, Craving, Response, Reward", "Plan, Act, Check, Do", "Think, Feel, Want, Get", "Start, Build, Grow, Scale"], correct: 0 }
//     ]
//   },
//   'verified-1984': {
//     bookId: 2,
//     questions: [
//       { q: "Who is the protagonist of 1984?", options: ["Big Brother", "O'Brien", "Winston Smith", "Emmanuel Goldstein"], correct: 2 },
//       { q: "What is the name of the official language of Oceania?", options: ["Oldspeak", "Newspeak", "Dutcha", "Prolespeak"], correct: 1 }
//     ]
//   }
// };
//
// const QuizView = ({ quizId, onExit, customQuizzes = [] }) => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//
//   // LOOKUP LOGIC: Find specific quiz by its unique ID
//   const quiz = customQuizzes.find(q => q.id === quizId) || VERIFIED_QUIZZES[quizId];
//
//   if (!quiz) {
//     return (
//       <div style={{ maxWidth: '700px', margin: '0 auto' }}>
//         <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '32px' }}>
//           <XCircle size={20} /> Close
//         </button>
//         <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
//           <HelpCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
//           <h3 style={{ color: '#1a1c1e', marginBottom: '8px' }}>Quiz Data Missing</h3>
//           <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
//             We couldn't retrieve the questions for this specific session. Please try selecting the quiz again.
//           </p>
//         </div>
//       </div>
//     );
//   }
//
//   const handleAnswer = (index) => {
//     if (index === quiz.questions[currentStep].correct) {
//       setScore(score + 1);
//     }
//     if (currentStep + 1 < quiz.questions.length) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       setShowResult(true);
//     }
//   };
//
//   if (showResult) {
//     return (
//       <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
//         <Trophy size={64} color="#f1c40f" style={{ marginBottom: '24px' }} />
//         <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Quiz Completed!</h2>
//         <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '32px' }}>
//           You scored <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong>
//         </p>
//         <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
//           <button onClick={onExit} style={{ padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
//             Exit to Quizzes
//           </button>
//           <button
//             onClick={() => { setCurrentStep(0); setScore(0); setShowResult(false); }}
//             style={{ padding: '12px 24px', background: '#1a1c1e', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
//           >
//             <RefreshCcw size={18} /> Retry
//           </button>
//         </div>
//       </div>
//     );
//   }
//
//   const currentQ = quiz.questions[currentStep];
//
//   return (
//     <div style={{ maxWidth: '700px', margin: '0 auto' }}>
//       <button onClick={onExit} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '32px' }}>
//         <XCircle size={20} /> Cancel Quiz
//       </button>
//
//       <div style={{ marginBottom: '40px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem', color: '#64748b' }}>
//           <span>Question {currentStep + 1} of {quiz.questions.length}</span>
//           <span>{Math.round((currentStep / quiz.questions.length) * 100)}% Complete</span>
//         </div>
//         <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
//           <div style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%`, height: '100%', background: '#3498db', transition: 'width 0.3s ease' }} />
//         </div>
//       </div>
//
//       <h2 style={{ fontSize: '1.75rem', marginBottom: '32px' }}>{currentQ.q}</h2>
//
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//         {currentQ.options.map((option, idx) => (
//           <button
//             key={idx}
//             onClick={() => handleAnswer(idx)}
//             style={{
//               padding: '20px 24px', textAlign: 'left', background: 'white',
//               border: '1px solid #e2e8f0', borderRadius: '16px', cursor: 'pointer',
//               fontSize: '1.1rem', transition: 'all 0.2s ease'
//             }}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default QuizView;