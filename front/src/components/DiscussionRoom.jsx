import React, { useState } from 'react';
import { 
  MessageSquare, Send, Users, X, ChevronLeft, ChevronRight, Search 
} from 'lucide-react';

const DiscussionRoom = ({ 
  discussions, 
  activeDiscussion, 
  setActiveDiscussion, 
  showCreateDiscussion, 
  setShowCreateDiscussion, 
  newDiscData, 
  setNewDiscData, 
  handleCreateDiscussion, 
  msgInput, 
  setMsgInput, 
  sendMessage,
  darkMode 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Local filtered list for search functionality
  const filteredDiscussions = discussions.filter(d => 
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- SUB-COMPONENT: THREAD LIST ---
  const DiscussionList = () => (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Community Hub</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Join the conversation with readers worldwide.</p>
        </div>
        <button 
          onClick={() => setShowCreateDiscussion(true)} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', 
            background: '#3498db', color: 'white', border: 'none', borderRadius: '12px', 
            cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(52, 152, 219, 0.3)' 
          }}
        >
          <PlusCircle size={18} /> New Thread
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
        <input 
          type="text" 
          placeholder="Search topics or titles..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', 
            border: '1px solid #e2e8f0', background: darkMode ? '#1e293b' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }} 
        />
      </div>

      {/* Create Modal/Inline Form */}
      {showCreateDiscussion && (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', padding: '24px', borderRadius: '16px', 
          border: '1px solid #3498db', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Launch a New Thread</h3>
            <X size={20} onClick={() => setShowCreateDiscussion(false)} style={{ cursor: 'pointer', color: '#64748b' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '16px' }}>
            <select 
              value={newDiscData.target} 
              onChange={e => setNewDiscData({...newDiscData, target: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#fff' : '#000' }}
            >
              <option>Book</option>
              <option>Author</option>
              <option>General</option>
            </select>
            <input 
              placeholder="Target Name (e.g. Andy Weir)" 
              value={newDiscData.topic} 
              onChange={e => setNewDiscData({...newDiscData, topic: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#fff' : '#000' }} 
            />
          </div>
          <input 
            placeholder="Discussion Title (e.g. The Ending Explained)" 
            value={newDiscData.title} 
            onChange={e => setNewDiscData({...newDiscData, title: e.target.value})} 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', background: darkMode ? '#0f172a' : '#fff', color: darkMode ? '#fff' : '#000' }} 
          />
          <button 
            onClick={handleCreateDiscussion} 
            style={{ width: '100%', padding: '14px', background: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Create Thread
          </button>
        </div>
      )}

      {/* Grid of Threads */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredDiscussions.map(d => (
          <div 
            key={d.id} 
            onClick={() => setActiveDiscussion(d)} 
            style={{ 
              background: darkMode ? '#1e293b' : 'white', padding: '24px', borderRadius: '16px', 
              border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.65rem', background: '#3498db', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold', color: '#fff' }}>
                  {d.target}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{d.topic}</span>
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem' }}>{d.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> {d.messages.length} messages</span>
                <span>•</span>
                <span>Active 2m ago</span>
              </div>
            </div>
            <ChevronRight style={{ color: '#94a3b8' }} />
          </div>
        ))}
      </div>
    </div>
  );

  // --- SUB-COMPONENT: CHAT ROOM ---
  const ChatView = () => (
    <div style={{ maxWidth: '1000px', margin: '0 auto', height: '100%' }}>
      <button 
        onClick={() => setActiveDiscussion(null)} 
        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
      >
        <ChevronLeft size={20} /> Exit to Community
      </button>
      
      <div style={{ 
        background: darkMode ? '#1e293b' : 'white', borderRadius: '20px', 
        border: '1px solid #e2e8f0', height: 'calc(100vh - 200px)', 
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', background: darkMode ? '#1e293b' : '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{activeDiscussion.title}</h2>
              <p style={{ margin: '4px 0 0 0', color: '#3498db', fontWeight: '500' }}>{activeDiscussion.target}: {activeDiscussion.topic}</p>
            </div>
            <div style={{ textAlign: 'right', color: '#64748b', fontSize: '0.85rem' }}>
              <Users size={18} style={{ marginBottom: '4px' }} />
              <div>12 Online</div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: darkMode ? '#0f172a' : '#f8fafc' }}>
          {activeDiscussion.messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>
              <MessageSquare size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No messages yet. Be the first to break the ice!</p>
            </div>
          )}
          {activeDiscussion.messages.map((m, i) => {
            const isMe = m.user === 'Me';
            return (
              <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.75rem', color: '#64748b', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  {!isMe && <span style={{ fontWeight: 'bold', color: '#3498db' }}>{m.user}</span>}
                  <span>{m.time}</span>
                </div>
                <div style={{ 
                  padding: '12px 18px', borderRadius: isMe ? '18px 18px 2px 18px' : '18px 18px 18px 2px', 
                  background: isMe ? '#3498db' : (darkMode ? '#334155' : 'white'), 
                  color: isMe ? 'white' : (darkMode ? '#fff' : '#1e293b'), 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: isMe ? 'none' : '1px solid #e2e8f0',
                  lineHeight: '1.5'
                }}>
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', background: darkMode ? '#1e293b' : '#fff' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: darkMode ? '#0f172a' : '#f1f5f9', padding: '8px', borderRadius: '16px' }}>
            <input 
              value={msgInput} 
              onChange={e => setMsgInput(e.target.value)} 
              placeholder="Share your thoughts..." 
              style={{ 
                flex: 1, padding: '12px 16px', background: 'transparent', 
                border: 'none', outline: 'none', color: darkMode ? '#fff' : '#000',
                fontSize: '1rem' 
              }} 
              onKeyPress={e => e.key === 'Enter' && sendMessage()} 
            />
            <button 
              onClick={sendMessage} 
              style={{ 
                background: '#3498db', color: 'white', border: 'none', 
                width: '44px', height: '44px', borderRadius: '12px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                cursor: 'pointer', transition: 'transform 0.1s' 
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {!activeDiscussion ? <DiscussionList /> : <ChatView />}
    </div>
  );
};

const PlusCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

export default DiscussionRoom;