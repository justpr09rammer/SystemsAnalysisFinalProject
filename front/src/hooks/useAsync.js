import { useState, useEffect, useCallback } from 'react';

export function useAsync(asyncFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn(...args);
            setData(result.data);
            return result.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => { execute(); }, [execute]);

    return { data, loading, error, refetch: execute };
}

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    const success = (msg) => addToast(msg, 'success');
    const error = (msg) => addToast(msg, 'error');
    const info = (msg) => addToast(msg, 'info');

    return { toasts, success, error, info };
}