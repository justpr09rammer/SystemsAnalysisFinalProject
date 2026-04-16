import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingCenter, Alert } from '../components/UI';

export default function ProfilePage({ toast }) {
    const { user, refreshUser, logout } = useAuth();
    const [tab, setTab] = useState('info');
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (user?.id) {
            // Try to get social stats
            import('../services/api').then(({ socialService }) => {
                socialService.getStats(user.id).then(r => setStats(r.data)).catch(() => {});
            });
        }
    }, [user?.id]);

    const changePassword = async (e) => {
        e.preventDefault();
        setPwError(''); setPwSuccess('');
        setLoading(true);
        try {
            await userService.changePassword(pwForm);
            setPwSuccess('Password changed successfully!');
            setPwForm({ currentPassword: '', newPassword: '' });
        } catch (e) { setPwError(e.response?.data?.message || 'Failed to change password'); }
        setLoading(false);
    };

    if (!user) return <LoadingCenter />;

    return (
        <div style={{ maxWidth: 700 }}>
            <div className="page-header">
                <h1>My Profile</h1>
            </div>

            {/* Profile card */}
            <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 24, alignItems: 'center', padding: 28 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a0e00', flexShrink: 0 }}>
                    {user.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{user.name} {user.surname}</h2>
                    <p style={{ color: 'var(--text2)', marginBottom: 8 }}>@{user.username} · {user.email}</p>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span className="badge badge-amber">{user.userRole}</span>
                        <span className={`badge ${user.enabled ? 'badge-green' : 'badge-red'}`}>
              {user.enabled ? 'Verified' : 'Unverified'}
            </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
                    {[
                        { label: 'Books Read', value: stats.booksRead, icon: '✅' },
                        { label: 'Reading Now', value: stats.booksReading, icon: '📖' },
                        { label: 'Want to Read', value: stats.booksWantToRead, icon: '🔖' },
                        { label: 'Reviews', value: stats.reviewsWritten, icon: '✍️' },
                        { label: 'Followers', value: stats.followersCount, icon: '👥' },
                        { label: 'Following', value: stats.followingCount, icon: '👤' },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: 2 }}>{s.value}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                {[{id:'info',label:'Account Info'},{id:'security',label:'Security'}].map(t => (
                    <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>
                ))}
            </div>

            {tab === 'info' && (
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        {[['First Name', user.name], ['Last Name', user.surname], ['Username', user.username], ['Email', user.email], ['Phone', user.phone]].map(([label, val]) => (
                            <div key={label}>
                                <div className="label" style={{ marginBottom: 4 }}>{label}</div>
                                <div className="input" style={{ pointerEvents: 'none', opacity: 0.8 }}>{val || '—'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'security' && (
                <div className="card" style={{ padding: 24, maxWidth: 400 }}>
                    <h3 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', marginBottom: 20 }}>Change Password</h3>
                    {pwError && <Alert type="error">{pwError}</Alert>}
                    {pwSuccess && <Alert type="success">{pwSuccess}</Alert>}
                    <form onSubmit={changePassword}>
                        <div className="form-group">
                            <label className="label">Current Password</label>
                            <input className="input" type="password" required value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="label">New Password</label>
                            <input className="input" type="password" required minLength={5} value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Update Password'}</button>
                    </form>
                    <div className="divider" />
                    <button className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Are you sure you want to delete your account?')) { userService.deleteAccount().then(() => logout()); } }}>
                        Delete Account
                    </button>
                </div>
            )}
        </div>
    );
}