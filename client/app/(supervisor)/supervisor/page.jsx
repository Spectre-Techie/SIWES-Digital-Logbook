'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import StatusBadge from '@/components/logs/StatusBadge';
import Button from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/ui/Skeletons';
import {
    Users,
    Clock,
    CheckCircle,
    ChartBar,
    Notebook,
    ArrowRight,
    Buildings,
} from '@phosphor-icons/react';

export default function SupervisorDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats/supervisor');
                setStats(data.data);
            } catch {
                // handled
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <DashboardSkeleton />;
    if (!stats) return null;

    const { overview, recentPendingLogs } = stats;

    const statCards = [
        { label: 'Students', value: overview.totalStudents, icon: Users, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Pending', value: overview.totalPendingLogs, icon: Clock, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning/10' },
        { label: 'Approved', value: overview.totalApprovedLogs, icon: CheckCircle, color: 'text-success', bg: 'bg-success-light dark:bg-success/10' },
        { label: 'Approval Rate', value: `${overview.approvalRate}%`, icon: ChartBar, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    ];

    return (
        <div className="page-container">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary">
                        Hello, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary mt-1">
                        Manage your students and review log entries
                    </p>
                </div>
                <Link href="/supervisor/students">
                    <Button><Users size={16} weight="bold" /> View Students</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {statCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className={`card p-5 ${s.bg} border-none`}>
                            <Icon size={22} weight="duotone" className={`${s.color} mb-2`} />
                            <p className={`text-display ${s.color}`}>{s.value}</p>
                            <p className="text-body text-text-secondary dark:text-text-dark-secondary mt-1">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Pending Review Queue */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="section-header flex items-center gap-2">
                        <Clock size={18} className="text-warning" /> Pending Review
                        {overview.totalPendingLogs > 0 && (
                            <span className="ml-1 px-2 py-0.5 rounded-full bg-warning-light text-warning-dark text-caption font-bold dark:bg-warning/20 dark:text-warning">
                                {overview.totalPendingLogs}
                            </span>
                        )}
                    </h2>
                    <Link href="/supervisor/students" className="text-caption font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                        View all <ArrowRight size={12} />
                    </Link>
                </div>

                {recentPendingLogs.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle size={40} weight="duotone" className="mx-auto text-primary mb-3" />
                        <h3 className="text-subheading text-text-primary dark:text-text-dark-primary mb-1">All caught up!</h3>
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">No pending log entries to review.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentPendingLogs.map((log) => (
                            <Link key={log.id} href={`/supervisor/students/${log.studentId}`} className="block group">
                                <div className="flex items-start justify-between p-3 rounded-lg hover:bg-surface-muted dark:hover:bg-surface-dark-muted transition-colors">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-caption font-bold text-white">
                                                {log.studentName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary">{log.studentName}</p>
                                            <p className="text-caption text-text-secondary dark:text-text-dark-secondary truncate">
                                                {(log.tasks || '').substring(0, 60)}{(log.tasks || '').length > 60 ? '...' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                                        <p className="text-caption font-medium text-text-secondary dark:text-text-dark-secondary">
                                            {format(new Date(log.date), 'MMM d')}
                                        </p>
                                        <StatusBadge status="pending" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
