'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { StatCardsSkeleton } from '@/components/ui/Skeletons';
import {
    Users,
    UserCirclePlus,
    ChartBar,
    Clock,
    CheckCircle,
    XCircle,
    Notebook,
    ArrowRight,
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data.data);
            } catch {
                // handled
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <div className="space-y-2 mb-8">
                    <div className="h-7 w-56 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-40 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <StatCardsSkeleton count={4} />
                <div className="mt-6"><StatCardsSkeleton count={4} /></div>
            </div>
        );
    }

    if (!stats) return null;

    const topCards = [
        { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Unassigned', value: stats.unassignedStudents, icon: UserCirclePlus, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning/10' },
        { label: 'Assigned', value: stats.assignedStudents, icon: CheckCircle, color: 'text-success', bg: 'bg-success-light dark:bg-success/10' },
        { label: 'Supervisors', value: stats.totalSupervisors, icon: Users, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    ];

    const logCards = [
        { label: 'Total Logs', value: stats.totalLogs, icon: Notebook, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        { label: 'Pending', value: stats.pendingLogs, icon: Clock, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning/10' },
        { label: 'Approved', value: stats.approvedLogs, icon: CheckCircle, color: 'text-success', bg: 'bg-success-light dark:bg-success/10' },
        { label: 'Approval Rate', value: `${stats.approvalRate}%`, icon: ChartBar, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary">
                        Welcome, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary mt-1">
                        Faculty Admin overview
                    </p>
                </div>
                <Link href="/admin/assign">
                    <Button><UserCirclePlus size={16} weight="bold" /> Assign Students</Button>
                </Link>
            </div>

            {/* People Stats */}
            <h2 className="section-header mb-3">People</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {topCards.map((s) => {
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

            {/* Log Stats */}
            <h2 className="section-header mb-3">Logs</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {logCards.map((s) => {
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

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { href: '/admin/students', label: 'View All Students', desc: 'Manage student profiles', icon: Users },
                    { href: '/admin/supervisors', label: 'View Supervisors', desc: 'See supervisor workloads', icon: Users },
                    { href: '/admin/assign', label: 'Assign Students', desc: 'Assign to supervisors', icon: UserCirclePlus },
                ].map((link) => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href} className="group">
                            <div className="card p-5 hover:shadow-card-hover transition-all duration-200">
                                <Icon size={24} weight="duotone" className="text-primary mb-3" />
                                <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary flex items-center gap-1">
                                    {link.label}
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </p>
                                <p className="text-caption text-text-secondary dark:text-text-dark-secondary">{link.desc}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
