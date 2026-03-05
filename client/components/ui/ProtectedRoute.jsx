'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from './Spinner';

function getHomeRoute(role) {
    if (role === 'faculty_admin') return '/admin';
    if (role === 'supervisor') return '/supervisor';
    return '/dashboard';
}

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (requiredRole && user.role !== requiredRole) {
                router.push(getHomeRoute(user.role));
            }
        }
    }, [user, loading, requiredRole, router]);

    if (loading) return <Spinner fullPage />;
    if (!user) return null;
    if (requiredRole && user.role !== requiredRole) return null;

    return children;
}
