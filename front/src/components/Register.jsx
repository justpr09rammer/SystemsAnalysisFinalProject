import { useState } from 'react';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();
    setStatus('Verification email sent! (Mock)');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Create Account</h2>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Join our community of readers today.</p>
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
          <input name="fullName" type="text" placeholder="John Doe" onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
          <input name="email" type="email" placeholder="email@example.com" onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
          <input name="password" type="password" placeholder="••••••••" onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} required />
        </div>
        
        {/* Changed to #1a1c1e (Black) */}
        <button type="submit" style={{ width: '100%', padding: '14px', background: '#1a1c1e', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Sign Up
        </button>
      </form>

      {status && <p style={{ color: '#2ecc71', marginTop: '16px', textAlign: 'center', fontWeight: '500' }}>{status}</p>}

      <p style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <span onClick={onSwitchToLogin} style={{ color: '#3498db', cursor: 'pointer', fontWeight: '600' }}>Sign In</span>
      </p>
    </div>
  );
};

export default Register;