import { useAuth } from '../context/AuthContext';

const icons = {
    home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    library: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    explore: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    reviews: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    progress: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    feed: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    login: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
    register: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    admin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

export default function Sidebar({ page, onNavigate }) {
    const { user, logout, isAuthenticated } = useAuth();

    const NavItem = ({ id, icon, label }) => (
        <div className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => onNavigate(id)}>
            {icons[icon]}
            <span>{label}</span>
        </div>
    );

    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">📖</div>
                <span className="logo-text">Readify</span>
            </div>

            <div className="nav-section">
                <div className="nav-label">Discover</div>
                <NavItem id="home" icon="home" label="Home" />
                <NavItem id="explore" icon="explore" label="Explore Books" />
                {isAuthenticated && <NavItem id="feed" icon="feed" label="Social Feed" />}
            </div>

            {isAuthenticated && (
                <div className="nav-section">
                    <div className="nav-label">My Reading</div>
                    <NavItem id="library" icon="library" label="My Library" />
                    <NavItem id="progress" icon="progress" label="Progress" />
                    <NavItem id="reviews" icon="reviews" label="My Reviews" />
                </div>
            )}

            <div className="nav-section">
                <div className="nav-label">Account</div>
                {isAuthenticated ? (
                    <>
                        <NavItem id="profile" icon="profile" label="Profile" />
                        {user?.userRole === 'ADMIN' && <NavItem id="admin" icon="admin" label="Admin Panel" />}
                        <div className="nav-item" onClick={logout} style={{ color: 'var(--red)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            <span>Sign Out</span>
                        </div>
                    </>
                ) : (
                    <>
                        <NavItem id="login" icon="login" label="Sign In" />
                        <NavItem id="register" icon="register" label="Create Account" />
                    </>
                )}
            </div>

            {isAuthenticated && (
                <div style={{ marginTop: 'auto', padding: '16px 24px 0', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', fontWeight: 700, color: '#1a0e00', fontSize: '0.9rem', flexShrink: 0 }}>
                            {user?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{user?.userRole}</div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}