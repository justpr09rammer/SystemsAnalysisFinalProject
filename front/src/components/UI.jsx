import { useState } from 'react';

export function Spinner({ size = 24 }) {
    return <div className="spinner" style={{ width: size, height: size }} />;
}

export function LoadingCenter() {
    return <div className="loading-center"><Spinner size={32} /></div>;
}

export function Toast({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
            ))}
        </div>
    );
}

export function Modal({ open, onClose, title, children, maxWidth = 520 }) {
    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>{title}</h3>
                    <button className="btn-ghost btn btn-icon" onClick={onClose} style={{ padding: 6 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function Stars({ rating, interactive = false, onRate, size = 16 }) {
    const [hover, setHover] = useState(0);
    const display = hover || rating || 0;
    return (
        <div className="stars">
            {[1,2,3,4,5].map(i => (
                <span
                    key={i}
                    className={`star ${i <= display ? 'filled' : ''}`}
                    style={{ fontSize: size, cursor: interactive ? 'pointer' : 'default' }}
                    onClick={() => interactive && onRate?.(i)}
                    onMouseEnter={() => interactive && setHover(i)}
                    onMouseLeave={() => interactive && setHover(0)}
                >★</span>
            ))}
        </div>
    );
}

export function ProgressBar({ value, max = 100, color }) {
    const pct = Math.min(100, Math.round((value / max) * 100));
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

export function BookCover({ src, title, width = 120, height = 180 }) {
    const [err, setErr] = useState(false);
    if (err || !src) {
        return (
            <div className="book-cover-placeholder" style={{ width, height, fontSize: Math.min(width, height) * 0.3 }}>
                📚
            </div>
        );
    }
    return <img src={src} alt={title} className="book-cover" width={width} height={height} onError={() => setErr(true)} style={{ objectFit: 'cover' }} />;
}

export function EmptyState({ icon = '📚', title = 'Nothing here', description = '', action }) {
    return (
        <div className="empty-state">
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            {description && <p style={{ marginBottom: action ? 20 : 0 }}>{description}</p>}
            {action}
        </div>
    );
}

export function Alert({ type = 'error', children }) {
    return <div className={`alert alert-${type}`}>{children}</div>;
}

export function Tabs({ tabs, active, onChange }) {
    return (
        <div className="tabs">
            {tabs.map(t => (
                <div key={t.id} className={`tab ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
                    {t.label}
                </div>
            ))}
        </div>
    );
}

export function Badge({ children, variant = 'amber' }) {
    return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function Confirm({ open, title, message, onConfirm, onCancel, danger }) {
    return (
        <Modal open={open} onClose={onCancel} title={title} maxWidth={380}>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>{message}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
                <button className={`btn btn-sm ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>Confirm</button>
            </div>
        </Modal>
    );
}