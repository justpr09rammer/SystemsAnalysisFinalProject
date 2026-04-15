import { Star } from 'lucide-react';

const BookCard = ({ book }) => {
  return (
    <div className="book-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '12px',
      width: '180px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0'
    }}>
      <img 
        src={book.coverImageUrl} 
        alt={book.title} 
        style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
      />
      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {book.title}
      </h4>
      <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#7f8c8d' }}>
        {book.authors?.[0]?.name}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f39c12', fontSize: '0.9rem' }}>
        <Star size={14} fill="#f39c12" /> {book.averageRating}
      </div>
    </div>
  );
};

export default BookCard;