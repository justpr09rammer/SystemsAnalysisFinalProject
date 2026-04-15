// import React, { useState } from 'react';
// import { ArrowLeft, Star, Book as BookIcon, BookmarkPlus, CheckCircle, Trash2 } from 'lucide-react';
//
// const BookDetails = ({ book, onBack, isFromLibrary, onUpdateShelf, onRemove, onUpdatePage }) => {
//   const [showSuccess, setShowSuccess] = useState(false);
//
//   if (!book) return null;
//
//   const handleShelfChange = (e) => {
//     onUpdateShelf(e.target.value);
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 2500);
//   };
//
//   return (
//     <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
//       <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '32px', padding: 0 }}>
//         <ArrowLeft size={20} /> Back
//       </button>
//
//       <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
//         <div style={{ flex: '0 0 320px' }}>
//           <img src={book.coverImageUrl} alt={book.title} style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
//
//           <div style={{ marginTop: '32px', padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
//             {isFromLibrary ? (
//               /* REFINED PROGRESS UI: FOR BOOKS ON SHELVES */
//               <div style={{ marginBottom: '24px' }}>
//                 <h4 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Reading Progress</h4>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                   <input
//                     type="number"
//                     value={book.currentPage || 0}
//                     onChange={(e) => onUpdatePage(parseInt(e.target.value) || 0)}
//                     style={{ width: '80px', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
//                   />
//                   <span style={{ color: '#64748b', fontSize: '0.9rem' }}>of {book.pageCount} pages</span>
//                 </div>
//                 <div style={{ marginTop: '12px', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
//                   <div style={{ width: `${book.userReadingPercent}%`, height: '100%', background: '#3498db', transition: 'width 0.3s ease' }} />
//                 </div>
//                 <p style={{ fontSize: '0.85rem', marginTop: '8px', color: '#3498db', fontWeight: 'bold' }}>
//                   {book.userReadingPercent}% Complete
//                 </p>
//               </div>
//             ) : (
//               /* ADD TO SHELF UI: FOR DISCOVERY */
//               <>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
//                   <  BookmarkPlus size={20} color="#3498db" />
//                   <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Add to Library</h4>
//                 </div>
//                 <select
//                   onChange={handleShelfChange}
//                   value={book.shelf || ""}
//                   style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', outline: 'none', fontSize: '0.95rem', marginBottom: '16px' }}
//                 >
//                   <option value="" disabled>Choose a shelf...</option>
//                   <option value="Currently Reading">Currently Reading</option>
//                   <option value="Want to Read">Want to Read</option>
//                   <option value="Favorites">Favorites</option>
//                 </select>
//
//                 {showSuccess && (
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2ecc71', marginBottom: '16px', fontSize: '0.85rem', fontWeight: '600' }}>
//                     <CheckCircle size={16} /> Added successfully!
//                   </div>
//                 )}
//               </>
//             )}
//
//             {/* SHARED REMOVE LOGIC */}
//             {book.shelf && (
//               <button
//                 onClick={onRemove}
//                 style={{
//                   width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
//                   background: 'none', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '8px', cursor: 'pointer',
//                   fontSize: '0.9rem', fontWeight: '500', marginTop: isFromLibrary ? '8px' : '0'
//                 }}
//               >
//                 <Trash2 size={16} /> Remove from Library
//               </button>
//             )}
//           </div>
//         </div>
//
//         <div style={{ flex: 1 }}>
//           <h1 style={{ fontSize: '3rem', margin: '0 0 8px 0', fontFamily: 'Merriweather, serif', lineHeight: 1.1 }}>{book.title}</h1>
//           <p style={{ fontSize: '1.25rem', color: '#64748b', margin: '0 0 24px 0' }}>by {book.authors?.map(a => a.name).join(', ')}</p>
//
//           <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <Star size={20} fill="#f1c40f" color="#f1c40f" />
//               <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{book.averageRating}</span>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
//               <BookIcon size={20} />
//               <span>{book.pageCount} pages</span>
//             </div>
//           </div>
//           <p style={{ lineHeight: 1.8, color: '#334155', fontSize: '1.1rem', margin: 0 }}>{book.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default BookDetails;