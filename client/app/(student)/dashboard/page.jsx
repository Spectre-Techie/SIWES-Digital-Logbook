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
    Notebook,
    Clock,
    CheckCircle,
    XCircle,
    CalendarCheck,
    TrendUp,
    Plus,
    ArrowRight,
    FileArrowDown,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function StudentDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats/student');
                setStats(data.data);
            } catch {
                // handled
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await api.get('/export/pdf', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'siwes-logbook.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('PDF exported successfully');
        } catch {
            toast.error('Failed to export PDF');
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <DashboardSkeleton />;
    if (!stats) return null;

    const { overview, weeklyLogs, recentLogs } = stats;

    const statCards = [
        { label: 'Total Logs', value: overview.totalLogs, icon: Notebook, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Pending', value: overview.pendingLogs, icon: Clock, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning/10' },
        { label: 'Approved', value: overview.approvedLogs, icon: CheckCircle, color: 'text-success', bg: 'bg-success-light dark:bg-success/10' },
        { label: 'Rejected', value: overview.rejectedLogs, icon: XCircle, color: 'text-danger', bg: 'bg-danger-light dark:bg-danger/10' },
        { label: 'Total Hours', value: overview.totalHours, icon: TrendUp, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Attendance', value: `${overview.attendanceRate}%`, icon: CalendarCheck, color: 'text-success', bg: 'bg-success-light dark:bg-success/10' },
    ];

    return (
        <div className="page-container">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary">
                        Welcome back, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary mt-1">
                        Here&apos;s your training progress overview
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport} loading={exporting}>
                        <FileArrowDown size={16} weight="bold" /> Export PDF
                    </Button>
                    <Link href="/logs/new">
                        <Button><Plus size={16} weight="bold" /> New Entry</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {statCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className={`card p-4 ${s.bg} border-none`}>
                            <Icon size={20} weight="duotone" className={`${s.color} mb-2`} />
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-caption text-text-secondary dark:text-text-dark-secondary">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Activity */}
                <div className="card p-5">
                    <h2 className="section-header mb-4">This Week</h2>
                    {weeklyLogs.length === 0 ? (
                        <div className="text-center py-6">
                            <p className="text-body text-text-secondary dark:text-text-dark-secondary mb-3">No logs this week yet</p>
                            <Link href="/logs/new"><Button size="sm">Create Entry</Button></Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {weeklyLogs.map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-muted dark:bg-surface-dark-muted">
                                    <div>
                                        <p className="text-body font-medium text-text-primary dark:text-text-dark-primary">
                                            {format(new Date(log.date), 'EEE, MMM d')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-caption font-medium text-primary-500">{log.hours} hrs</span>
                                        <StatusBadge status={log.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Logs */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="section-header">Recent Entries</h2>
                        <Link href="/logs" className="text-caption font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    {recentLogs.length === 0 ? (
                        <p className="text-center text-body text-text-secondary py-6">No entries yet</p>
                    ) : (
                        <div className="space-y-2">
                            {recentLogs.map((log) => (
                                <Link key={log.id} href={`/logs/${log.id}`} className="block">
                                    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-surface-muted dark:hover:bg-surface-dark-muted transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body font-medium text-text-primary dark:text-text-dark-primary truncate">
                                                {(log.tasks || '').substring(0, 60)}{(log.tasks || '').length > 60 ? '...' : ''}
                                            </p>
                                            <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary">
                                                {format(new Date(log.date), 'MMM d, yyyy')} · {log.hours} hrs
                                            </p>
                                        </div>
                                        <StatusBadge status={log.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
