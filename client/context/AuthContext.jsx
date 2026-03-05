'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Rehydrate session on mount
    useEffect(() => {
        const token = localStorage.getItem('siwes_token');
        const savedUser = localStorage.getItem('siwes_user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('siwes_token');
                localStorage.removeItem('siwes_user');
            }
        }
        setLoading(false);
    }, []);

    const getHomeRoute = (role) => {
        if (role === 'faculty_admin') return '/admin';
        if (role === 'supervisor') return '/supervisor';
        return '/dashboard';
    };

    const login = useCallback(async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('siwes_token', data.data.token);
        localStorage.setItem('siwes_user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        router.push(getHomeRoute(data.data.user.role));
    }, [router]);

    const register = useCallback(async (formData) => {
        const { data } = await api.post('/auth/register', formData);
        localStorage.setItem('siwes_token', data.data.token);
        localStorage.setItem('siwes_user', JSON.stringify(data.data.user));
        setUser(data.data.user);
        router.push(getHomeRoute(data.data.user.role));
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem('siwes_token');
        localStorage.removeItem('siwes_user');
        setUser(null);
        router.push('/login');
    }, [router]);

    const value = { user, loading, login, register, logout, isAuthenticated: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
