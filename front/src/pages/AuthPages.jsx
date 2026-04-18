import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/UI';

export function LoginPage({ onNavigate, toast }) {
    const { login, loading } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(form.email, form.password);
        if (result.success) {
            toast?.success('Welcome back!');
            onNavigate('home');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: '60px auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📖</div>
                <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Welcome back</h1>
                <p style={{ color: 'var(--text2)' }}>Sign in to your Readify account</p>
            </div>

            <div className="card" style={{ padding: 28 }}>
                {error && <Alert type="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input className="input" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="form-group">
                        <label className="label">Password</label>
                        <input className="input" type="password" placeholder="••••••••" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }} type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }} onClick={() => onNavigate('register')}>
            Create one
          </span>
                </p>
            </div>
        </div>
    );
}

export function RegisterPage({ onNavigate, toast }) {
    const { register, verify } = useAuth();
    const [step, setStep] = useState('register'); // 'register' | 'verify'
    const [form, setForm] = useState({ name: '', surname: '', userName: '', email: '', password: '', phone: '' });
    const [verifyCode, setVerifyCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await register(form);
        setLoading(false);
        if (result.success) {
            toast?.success('Account created! Check your email for the verification code.');
            setStep('verify');
        } else {
            setError(result.message);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await verify(form.email, verifyCode);
        setLoading(false);
        if (result.success) {
            toast?.success('Account verified! You can now sign in.');
            onNavigate('login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div style={{ maxWidth: 460, margin: '40px auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📚</div>
                <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{step === 'register' ? 'Create Account' : 'Verify Email'}</h1>
                <p style={{ color: 'var(--text2)' }}>
                    {step === 'register' ? 'Join thousands of readers on Readify' : `We sent a code to ${form.email}`}
                </p>
            </div>

            <div className="card" style={{ padding: 28 }}>
                {error && <Alert type="error">{error}</Alert>}

                {step === 'register' ? (
                    <form onSubmit={handleRegister}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label className="label">First Name</label>
                                <input className="input" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="label">Last Name</label>
                                <input className="input" required value={form.surname} onChange={e => setForm(p => ({ ...p, surname: e.target.value }))} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label">Username</label>
                            <input className="input" required value={form.userName} onChange={e => setForm(p => ({ ...p, userName: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="label">Email</label>
                            <input className="input" type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="label">Phone</label>
                            <input className="input" type="tel" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div className="form-group">
                            <label className="label">Password</label>
                            <input className="input" type="password" required minLength={5} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label className="label">Verification Code</label>
                            <input className="input" placeholder="Enter 6-digit code" required value={verifyCode} onChange={e => setVerifyCode(e.target.value)} style={{ fontSize: '1.2rem', letterSpacing: '4px', textAlign: 'center' }} />
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} type="submit" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Account'}
                        </button>
                        <button type="button" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={() => setStep('register')}>
                            ← Back
                        </button>
                    </form>
                )}

                {step === 'register' && (
                    <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }} onClick={() => onNavigate('login')}>Sign in</span>
                    </p>
                )}
            </div>
        </div>
    );
}