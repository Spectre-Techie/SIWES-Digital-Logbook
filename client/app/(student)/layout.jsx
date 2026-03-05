'use client';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';

export default function StudentLayout({ children }) {
    return (
        <ProtectedRoute requiredRole="student">
            <Sidebar />
            <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
                {children}
            </main>
        </ProtectedRoute>
    );
}
