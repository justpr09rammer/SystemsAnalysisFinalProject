import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setToken(data.token);
            // Fetch user profile
            const profile = await api.get('/users/my-profile', {
                headers: { Authorization: `Bearer ${data.token}` }
            });
            localStorage.setItem('user', JSON.stringify(profile.data));
            setUser(profile.data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || err.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            await api.post('/auth/signup', userData);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || err.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const verify = async (email, code) => {
        try {
            await api.post('/auth/verify', { email, verificationCode: code });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Verification failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const { data } = await api.get('/users/my-profile');
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        } catch {}
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, verify, logout, refreshUser, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);