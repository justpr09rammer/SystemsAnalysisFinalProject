import { useState, useEffect } from 'react';
import { userService, bookService, authorService, genreService } from '../services/api';
import { LoadingCenter } from '../components/UI';

export default function AdminPage({ toast }) {
    const [tab, setTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [importQuery, setImportQuery] = useState('');
    const [importLimit, setImportLimit] = useState(10);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);

    useEffect(() => {
        userService.getStats().then(r => setStats(r.data)).catch(() => {});
        userService.getAll(0).then(r => setUsers(r.data?.content || [])).catch(() => {});
    }, []);

    const handleImport = async () => {
        if (!importQuery.trim()) return;
        setImporting(true);
        setImportResult(null);
        try {
            const r = await bookService.importFromOpenLibrary(importQuery, importLimit);
            setImportResult({ success: true, count: r.data?.length || 0, books: r.data || [] });
            toast?.success(`Imported ${r.data?.length || 0} books!`);
        } catch (e) {
            setImportResult({ success: false, message: e.response?.data?.message || 'Import failed' });
            toast?.error('Import failed');
        }
        setImporting(false);
    };

    return (
        <div style={{ maxWidth: 900 }}>
            <div className="page-header">
                <h1>Admin Panel</h1>
                <p>Manage your Readify application</p>
            </div>

            <div className="tabs">
                {[{id:'stats',label:'Dashboard'},{id:'users',label:'Users'},{id:'import',label:'Import Books'}].map(t => (
                    <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>
                ))}
            </div>

            {tab === 'stats' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                        {stats && [
                            { label: 'Total Users', value: stats.total, icon: '👥', color: 'var(--blue)' },
                            { label: 'Active Users', value: stats.active, icon: '✅', color: 'var(--green)' },
                            { label: 'Deleted Users', value: stats.deleted, icon: '🗑️', color: 'var(--red)' },
                        ].map(s => (
                            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{s.icon}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                                <div style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'users' && (
                <div>
                    <h2 className="section-title">User Management</h2>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['ID', 'Username', 'Email', 'Role', 'Status', 'Verified'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text3)' }}>{u.id}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '0.85rem', fontWeight: 500 }}>{u.username}</td>
                                    <td style={{ padding: '10px 16px', fontSize: '0.85rem', color: 'var(--text2)' }}>{u.email}</td>
                                    <td style={{ padding: '10px 16px' }}>
                                        <span className={`badge ${u.userRole === 'ADMIN' ? 'badge-amber' : 'badge-blue'}`}>{u.userRole}</span>
                                    </td>
                                    <td style={{ padding: '10px 16px' }}>
                                        <span className={`badge ${u.userStatus === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>{u.userStatus}</span>
                                    </td>
                                    <td style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
                                        {u.enabled ? '✅' : '❌'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'import' && (
                <div style={{ maxWidth: 500 }}>
                    <h2 className="section-title">Import Books from OpenLibrary</h2>
                    <div className="card">
                        <div className="form-group">
                            <label className="label">Search Query</label>
                            <input className="input" placeholder="e.g. Harry Potter, Stephen King..." value={importQuery} onChange={e => setImportQuery(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="label">Number of books to import (max 50)</label>
                            <input className="input" type="number" min={1} max={50} value={importLimit} onChange={e => setImportLimit(parseInt(e.target.value))} />
                        </div>
                        <button className="btn btn-primary" onClick={handleImport} disabled={importing || !importQuery.trim()} style={{ width: '100%', justifyContent: 'center' }}>
                            {importing ? 'Importing...' : 'Import Books'}
                        </button>

                        {importResult && (
                            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: importResult.success ? 'rgba(123,198,126,0.1)' : 'rgba(240,128,128,0.1)', border: `1px solid ${importResult.success ? 'rgba(123,198,126,0.3)' : 'rgba(240,128,128,0.3)'}`, color: importResult.success ? 'var(--green)' : 'var(--red)' }}>
                                {importResult.success ? `✅ Successfully imported ${importResult.count} books!` : `❌ ${importResult.message}`}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}