// import { useState } from 'react';
// import {
//   BookOpen, Home, Library, Bookmark, ChevronLeft,
//   HelpCircle, LogIn, UserPlus, Settings, PlusCircle,
//   MessageSquare, Send, Users, X
// } from 'lucide-react';
//
// import BookCard from './components/BookCard';
// import BookDetails from './components/BookDetails';
// import QuizView from './components/QuizView';
// import CreateQuiz from './components/CreateQuiz';
// import SettingsPage from './components/SettingsPage';
// import Register from './components/Register';
//
// const INITIAL_BOOKS = [
//   { id: 1, title: "The Great Gatsby", coverImageUrl: "https://covers.openlibrary.org/b/id/12643540-L.jpg", averageRating: 4.5, authors: [{ name: "F. Scott Fitzgerald" }], userReadingPercent: 45, currentPage: 81, pageCount: 180, shelf: "Currently Reading", description: "A portrait of the Jazz Age in all of its decadence and excess." },
//   { id: 2, title: "1984", coverImageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg", averageRating: 4.8, authors: [{ name: "George Orwell" }], userReadingPercent: 10, currentPage: 33, pageCount: 328, shelf: "Currently Reading", description: "A dystopian social science fiction novel." },
//   { id: 3, title: "The Hobbit", coverImageUrl: "https://covers.openlibrary.org/b/id/10405230-L.jpg", averageRating: 4.7, authors: [{ name: "J.R.R. Tolkien" }], userReadingPercent: 0, currentPage: 0, pageCount: 310, shelf: "Want to Read", description: "A treasure-hunting adventure." },
//   { id: 4, title: "Atomic Habits", coverImageUrl: "https://covers.openlibrary.org/b/id/12836261-L.jpg", averageRating: 4.9, authors: [{ name: "James Clear" }], userReadingPercent: 100, currentPage: 320, pageCount: 320, shelf: "Favorites", description: "A framework for improving every day." },
//   { id: 5, title: "The Alchemist", coverImageUrl: "https://covers.openlibrary.org/b/id/14546416-L.jpg", averageRating: 4.6, authors: [{ name: "Paulo Coelho" }], userReadingPercent: 100, currentPage: 208, pageCount: 208, shelf: "Favorites", description: "A journey of self-discovery." },
//   { id: 6, title: "Dune", coverImageUrl: "https://covers.openlibrary.org/b/id/10443111-L.jpg", averageRating: 4.7, authors: [{ name: "Frank Herbert" }], userReadingPercent: 0, currentPage: 0, pageCount: 412, shelf: null, description: "The epic sci-fi masterpiece." },
//   { id: 7, title: "Deep Work", coverImageUrl: "https://covers.openlibrary.org/b/id/12530113-L.jpg", averageRating: 4.5, authors: [{ name: "Cal Newport" }], userReadingPercent: 0, currentPage: 0, pageCount: 304, shelf: null, description: "Rules for focused success." },
//   { id: 8, title: "Brave New World", coverImageUrl: "https://covers.openlibrary.org/b/id/10444342-L.jpg", averageRating: 4.4, authors: [{ name: "Aldous Huxley" }], userReadingPercent: 0, currentPage: 0, pageCount: 268, shelf: null, description: "A vision of the future." },
//   { id: 9, title: "Project Hail Mary", coverImageUrl: "https://covers.openlibrary.org/b/id/11181512-L.jpg", averageRating: 4.9, authors: [{ name: "Andy Weir" }], userReadingPercent: 0, currentPage: 0, pageCount: 476, shelf: null, description: "A lone astronaut must save Earth." },
//   { id: 10, title: "The Silent Patient", coverImageUrl: "https://covers.openlibrary.org/b/id/12817812-L.jpg", averageRating: 4.3, authors: [{ name: "Alex Michaelides" }], userReadingPercent: 0, currentPage: 0, pageCount: 336, shelf: null, description: "A psychological thriller." }
// ];
//
// const VERIFIED_LIST = [
//   { id: 'verified-atomic', bookId: 4, title: 'Atomic Habits', type: 'Verified Quiz' },
//   { id: 'verified-1984', bookId: 2, title: '1984', type: 'Verified Quiz' }
// ];
//
// function App() {
//   const [view, setView] = useState('browse');
//   const [activeShelf, setActiveShelf] = useState(null);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   const [books, setBooks] = useState(INITIAL_BOOKS);
//   const [customQuizzes, setCustomQuizzes] = useState([]);
//   const [darkMode, setDarkMode] = useState(false);
//
//   const [discussions, setDiscussions] = useState([
//     { id: 1, topic: "The Great Gatsby", target: "Book", title: "Symbols of the Green Light", messages: [{ user: "Admin", text: "What do you think the light represents?", time: "10:00 AM" }] },
//     { id: 2, topic: "Andy Weir", target: "Author", title: "Scientific Accuracy in Project Hail Mary", messages: [{ user: "SpaceGeek", text: "The physics behind the 'astrophage' is fascinating!", time: "11:30 AM" }] }
//   ]);
//   const [activeDiscussion, setActiveDiscussion] = useState(null);
//   const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
//   const [newDiscData, setNewDiscData] = useState({ topic: '', target: 'Book', title: '' });
//   const [msgInput, setMsgInput] = useState('');
//
//   const updateBookShelf = (bookId, shelfName) => {
//     setBooks(prev => prev.map(b => b.id === bookId ? { ...b, shelf: shelfName } : b));
//     setSelectedBook(prev => prev ? { ...prev, shelf: shelfName } : null);
//   };
//
//   const removeFromShelf = (bookId) => {
//     setBooks(prev => prev.map(b => b.id === bookId ? { ...b, shelf: null, userReadingPercent: 0, currentPage: 0 } : b));
//     setSelectedBook(null);
//     setView('browse');
//   };
//
//   const updatePageProgress = (bookId, newPage) => {
//     setBooks(prev => prev.map(b => {
//       if (b.id === bookId) {
//         const page = Math.min(Math.max(0, newPage), b.pageCount);
//         const percent = Math.round((page / b.pageCount) * 100);
//         const updatedBook = { ...b, currentPage: page, userReadingPercent: percent };
//         if (selectedBook?.id === bookId) setSelectedBook(updatedBook);
//         return updatedBook;
//       }
//       return b;
//     }));
//   };
//
//   const handleCreateQuiz = (newQuiz) => {
//     setCustomQuizzes(prev => [...prev, newQuiz]);
//     setView('quizzes');
//   };
//
//   const handleCreateDiscussion = () => {
//     if (!newDiscData.topic || !newDiscData.title) return;
//     const disc = { ...newDiscData, id: Date.now(), messages: [] };
//     setDiscussions([disc, ...discussions]);
//     setShowCreateDiscussion(false);
//     setNewDiscData({ topic: '', target: 'Book', title: '' });
//   };
//
//   const sendMessage = () => {
//     if (!msgInput.trim()) return;
//     const newMsg = { user: "Me", text: msgInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
//     setDiscussions(prev => prev.map(d => d.id === activeDiscussion.id ? { ...d, messages: [...d.messages, newMsg] } : d));
//     setActiveDiscussion(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
//     setMsgInput('');
//   };
//
//   const NavItem = ({ id, icon: Icon, label }) => (
//     <div
//       onClick={() => { setView(id); setSelectedBook(null); setActiveShelf(null); setActiveQuiz(null); setActiveDiscussion(null); }}
//       style={{
//         display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
//         cursor: 'pointer', borderRadius: '8px',
//         background: (view === id && !activeQuiz) ? 'rgba(255,255,255,0.1)' : 'transparent',
//         color: (view === id && !activeQuiz) ? '#fff' : '#94a3b8', marginBottom: '4px'
//       }}
//     >
//       <Icon size={20} />
//       <span style={{ fontWeight: '500' }}>{label}</span>
//     </div>
//   );
//
//   return (
//     <div style={{ display: 'flex', height: '100vh', width: '100vw', background: darkMode ? '#0f172a' : '#f8fafc', overflow: 'hidden' }}>
//       <aside style={{ width: '280px', background: '#1a1c1e', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
//           <BookOpen size={28} color="#3498db" />
//           <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontFamily: 'Merriweather, serif' }}>CookABook</h2>
//         </div>
//         <nav style={{ flex: 1 }}>
//           <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Library</p>
//           <NavItem id="browse" icon={Home} label="Discover" />
//           <NavItem id="library" icon={Library} label="My Shelves" />
//           <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '24px 0 12px 0' }}>Engagement</p>
//           <NavItem id="quizzes" icon={HelpCircle} label="Quizzes" />
//           <NavItem id="create-quiz" icon={PlusCircle} label="Create Quiz" />
//           <NavItem id="discussions" icon={Users} label="Community" />
//           <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '24px 0 12px 0' }}>System</p>
//           <NavItem id="settings" icon={Settings} label="Settings" />
//           <div style={{ margin: '12px 0', borderTop: '1px solid #334155' }} />
//           <NavItem id="register" icon={UserPlus} label="Create Account" />
//           <NavItem id="login" icon={LogIn} label="Sign In" />
//         </nav>
//       </aside>
//
//       <main
//         style={{
//           flex: 1,
//           padding: '40px',
//           background: darkMode ? '#121212' : '#fdfcfb',
//           color: darkMode ? '#fff' : '#000',
//           overflowY: 'auto',
//           height: '100vh',         // Force to viewport height
//           boxSizing: 'border-box'  // Ensures padding doesn't add to width/height
//         }}
//       >
//         {view === 'browse' && (
//           <>
//             <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Explore Books</h1>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
//               {books.map(book => (
//                 <div key={book.id} onClick={() => { setSelectedBook(book); setView('details'); }} style={{ cursor: 'pointer' }}>
//                   <BookCard book={book} />
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//
//         {view === 'discussions' && (
//           <div style={{ maxWidth: '900px', margin: '0 auto' }}>
//             {!activeDiscussion ? (
//               <>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
//                   <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Discussions</h1>
//                   <button onClick={() => setShowCreateDiscussion(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
//                     <MessageSquare size={18} /> Start Discussion
//                   </button>
//                 </div>
//
//                 {showCreateDiscussion && (
//                   <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//                       <h3 style={{ margin: 0 }}>New Discussion</h3>
//                       <X size={20} onClick={() => setShowCreateDiscussion(false)} style={{ cursor: 'pointer' }} />
//                     </div>
//                     <div style={{ display: 'grid', gap: '16px' }}>
//                       <select value={newDiscData.target} onChange={e => setNewDiscData({...newDiscData, target: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
//                         <option>Book</option>
//                         <option>Author</option>
//                       </select>
//                       <input placeholder="Topic Name (e.g. 1984)" value={newDiscData.topic} onChange={e => setNewDiscData({...newDiscData, topic: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                       <input placeholder="Discussion Title" value={newDiscData.title} onChange={e => setNewDiscData({...newDiscData, title: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
//                       <button onClick={handleCreateDiscussion} style={{ padding: '14px', background: '#1a1c1e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Create Thread</button>
//                     </div>
//                   </div>
//                 )}
//
//                 <div style={{ display: 'grid', gap: '16px' }}>
//                   {discussions.map(d => (
//                     <div key={d.id} onClick={() => setActiveDiscussion(d)} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <div>
//                         <span style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold', color: '#475569' }}>{d.target}: {d.topic}</span>
//                         <h3 style={{ margin: '8px 0 4px 0' }}>{d.title}</h3>
//                         <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{d.messages.length} messages</p>
//                       </div>
//                       <ChevronLeft style={{ transform: 'rotate(180deg)', color: '#94a3b8' }} />
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div>
//                 <button onClick={() => setActiveDiscussion(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <ChevronLeft size={20} /> Back to Community
//                 </button>
//                 <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', height: '600px', display: 'flex', flexDirection: 'column' }}>
//                   <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
//                     <h2 style={{ margin: 0 }}>{activeDiscussion.title}</h2>
//                     <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>{activeDiscussion.target}: {activeDiscussion.topic}</p>
//                   </div>
//                   <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#f8fafc' }}>
//                     {activeDiscussion.messages.map((m, i) => (
//                       <div key={i} style={{ alignSelf: m.user === 'Me' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
//                         <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', fontSize: '0.75rem', color: '#64748b', justifyContent: m.user === 'Me' ? 'flex-end' : 'flex-start' }}>
//                           <span>{m.user}</span> • <span>{m.time}</span>
//                         </div>
//                         <div style={{ padding: '12px 16px', borderRadius: '12px', background: m.user === 'Me' ? '#3498db' : 'white', color: m.user === 'Me' ? 'white' : 'black', border: m.user === 'Me' ? 'none' : '1px solid #e2e8f0' }}>
//                           {m.text}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
//                     <input value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} onKeyPress={e => e.key === 'Enter' && sendMessage()} />
//                     <button onClick={sendMessage} style={{ background: '#3498db', color: 'white', border: 'none', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//                       <Send size={20} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//
//         {view === 'library' && !activeShelf && (
//           <>
//             <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>My Shelves</h1>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
//               {["Currently Reading", "Want to Read", "Favorites"].map(shelfName => (
//                 <div key={shelfName} onClick={() => setActiveShelf(shelfName)} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
//                   <Bookmark color="#3498db" />
//                   <div>
//                     <h3 style={{ margin: 0 }}>{shelfName}</h3>
//                     <p style={{ margin: 0, color: '#64748b' }}>{books.filter(b => b.shelf === shelfName).length} books</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//
//         {view === 'library' && activeShelf && (
//           <>
//             <button onClick={() => setActiveShelf(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//               <ChevronLeft size={20} /> Back to Shelves
//             </button>
//             <h1 style={{ fontSize: '2.5rem', marginBottom: '32px' }}>{activeShelf}</h1>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
//               {books.filter(book => book.shelf === activeShelf).map(book => (
//                 <div key={book.id} onClick={() => { setSelectedBook(book); setView('details'); }} style={{ cursor: 'pointer' }}>
//                   <BookCard book={book} />
//                   <div style={{ marginTop: '12px' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
//                       <span>Progress</span>
//                       <span>{book.currentPage || 0} / {book.pageCount}</span>
//                     </div>
//                     <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
//                       <div style={{ width: `${book.userReadingPercent}%`, height: '100%', background: '#3498db', borderRadius: '3px' }} />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//
//         {view === 'quizzes' && !activeQuiz && (
//           <>
//             <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Book Quizzes</h1>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
//               {[...VERIFIED_LIST, ...customQuizzes].map((item) => {
//                 const bookInfo = books.find(b => b.id === item.bookId);
//                 return (
//                   <div key={item.id} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
//                     <div style={{ display: 'flex', gap: '16px' }}>
//                       <img src={bookInfo?.coverImageUrl} style={{ width: '60px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} />
//                       <div>
//                         <h3 style={{ margin: '0 0 4px 0' }}>{bookInfo?.title}</h3>
//                         <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{item.id.toString().startsWith('verified') ? 'Verified' : 'User Created'}</p>
//                       </div>
//                     </div>
//                     <button onClick={() => setActiveQuiz(item.id)} style={{ width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Start Quiz</button>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//
//         {view === 'create-quiz' && <CreateQuiz books={books.filter(b => b.userReadingPercent === 100)} onCreated={handleCreateQuiz} />}
//         {view === 'settings' && <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />}
//         {activeQuiz && <QuizView quizId={activeQuiz} customQuizzes={customQuizzes} onExit={() => setActiveQuiz(null)} />}
//         {view === 'details' && selectedBook && (
//           <BookDetails book={selectedBook} onBack={() => setView(activeShelf ? 'library' : 'browse')} isFromLibrary={activeShelf !== null} onUpdateShelf={(s) => updateBookShelf(selectedBook.id, s)} onUpdatePage={(p) => updatePageProgress(selectedBook.id, p)} onRemove={() => removeFromShelf(selectedBook.id)} />
//         )}
//         {view === 'login' && (
//           <div style={{ maxWidth: '400px', margin: '60px auto' }}>
//             <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome Back</h2>
//             <p style={{ color: '#64748b', marginBottom: '32px' }}>Access your personalized library and quizzes.</p>
//             <form>
//               <div style={{ marginBottom: '16px' }}>
//                 <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
//                 <input type="email" placeholder="email@example.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
//               </div>
//               <div style={{ marginBottom: '24px' }}>
//                 <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
//                 <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
//               </div>
//               <button type="submit" style={{ width: '100%', padding: '14px', background: '#1a1c1e', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Sign In</button>
//             </form>
//             <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '0.9rem' }}>
//               Don't have an account?{' '}
//               <span onClick={() => setView('register')} style={{ color: '#3498db', cursor: 'pointer', fontWeight: '600' }}>Create Account</span>
//             </p>
//           </div>
//         )}
//         {view === 'register' && <Register onSwitchToLogin={() => setView('login')} />}
//       </main>
//
//       <aside style={{ width: '320px', background: darkMode ? '#1e293b' : '#f8fafc', borderLeft: '1px solid #e2e8f0', padding: '24px', flexShrink: 0, height: '100%', overflowY: 'auto' }}>
//         <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '24px', position: 'sticky', top: '0px' }}>
//           <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Sponsored</p>
//           <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.9rem' }}>Ad Space</div>
//         </div>
//         <div>
//           <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Active Now</h4>
//           {discussions.slice(0, 3).map(d => (
//             <div key={d.id} onClick={() => { setView('discussions'); setActiveDiscussion(d); }} style={{ padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px', cursor: 'pointer' }}>
//               <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>{d.title}</p>
//               <span style={{ fontSize: '0.75rem', color: '#3498db' }}>{d.topic}</span>
//             </div>
//           ))}
//         </div>
//       </aside>
//     </div>
//   );
// }
//
// export default App;



import { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import RightPanel from './components/RightPanel';
import { Toast } from './components/UI';
import { useToast } from './hooks/useAsync';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import BookDetailPage from './pages/BookDetailPage';
import LibraryPage from './pages/LibraryPage';
import ProgressPage from './pages/ProgressPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

function AppContent() {
    const { isAuthenticated } = useAuth();
    const [page, setPage] = useState('home');
    const [bookId, setBookId] = useState(null);
    const toast = useToast();

    const navigate = useCallback((p) => {
        setPage(p);
        setBookId(null);
    }, []);

    const selectBook = useCallback((id) => {
        setBookId(id);
        setPage('book');
    }, []);

    const renderPage = () => {
        if (page === 'book' && bookId) {
            return <BookDetailPage bookId={bookId} onBack={() => window.history.back ? navigate('home') : navigate('home')} toast={toast} />;
        }
        switch (page) {
            case 'home': return <HomePage onNavigate={navigate} onBookSelect={selectBook} />;
            case 'explore': return <ExplorePage onBookSelect={selectBook} />;
            case 'library': return isAuthenticated ? <LibraryPage onBookSelect={selectBook} toast={toast} /> : <LoginPage onNavigate={navigate} toast={toast} />;
            case 'progress': return isAuthenticated ? <ProgressPage onBookSelect={selectBook} toast={toast} /> : <LoginPage onNavigate={navigate} toast={toast} />;
            case 'reviews':
            case 'feed': return isAuthenticated ? <FeedPage onBookSelect={selectBook} /> : <LoginPage onNavigate={navigate} toast={toast} />;
            case 'profile': return isAuthenticated ? <ProfilePage toast={toast} /> : <LoginPage onNavigate={navigate} toast={toast} />;
            case 'admin': return isAuthenticated ? <AdminPage toast={toast} /> : <LoginPage onNavigate={navigate} toast={toast} />;
            case 'login': return <LoginPage onNavigate={navigate} toast={toast} />;
            case 'register': return <RegisterPage onNavigate={navigate} toast={toast} />;
            default: return <HomePage onNavigate={navigate} onBookSelect={selectBook} />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar page={page} onNavigate={navigate} />
            <main className="main-content">
                {renderPage()}
            </main>
            <aside className="right-panel">
                <RightPanel onBookSelect={selectBook} />
            </aside>
            <Toast toasts={toast.toasts} />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}











