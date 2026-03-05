'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { StudentListSkeleton } from '@/components/ui/Skeletons';
import Button from '@/components/ui/Button';
import {
    Users,
    MagnifyingGlass,
    Buildings,
    Notebook,
    GraduationCap,
    FunnelSimple,
} from '@phosphor-icons/react';
import clsx from 'clsx';

const filterOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'Assigned' },
    { value: 'false', label: 'Unassigned' },
];

export default function AdminStudentsPage() {
    const [students, setStudents] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [assigned, setAssigned] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, ...(debouncedSearch && { search: debouncedSearch }), ...(assigned && { assigned }) };
            const { data } = await api.get('/admin/students', { params });
            setStudents(data.data);
            setMeta(data.meta);
        } catch {
            // handled
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, assigned]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    if (loading && !students.length) return <StudentListSkeleton />;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <Users size={22} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-heading text-text-primary dark:text-text-dark-primary">All Students</h1>
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                            {meta ? `${meta.total} total` : 'Loading...'}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchStudents(); }} className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search students..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-dark-elevated text-body placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                </form>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6">
                <FunnelSimple size={16} className="text-text-tertiary" />
                {filterOptions.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => { setAssigned(f.value); setPage(1); }}
                        className={clsx(
                            'px-3 py-1.5 rounded-lg text-caption font-semibold transition-all',
                            assigned === f.value
                                ? 'bg-neutral-800 text-white dark:bg-neutral-700'
                                : 'bg-surface-muted text-text-secondary hover:bg-neutral-200 dark:bg-surface-dark-elevated dark:text-text-dark-secondary'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Student grid */}
            {students.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users size={40} className="mx-auto text-text-tertiary mb-4" />
                    <h3 className="text-subheading text-text-primary dark:text-text-dark-primary mb-2">No students found</h3>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                        {search || assigned ? 'Try different filters.' : 'No students registered yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map((student) => (
                            <div key={student.id} className="card p-5 flex items-start gap-4">
                                {/* Avatar */}
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                                    <span className="text-body font-bold text-white">
                                        {student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary truncate">
                                            {student.name}
                                        </p>
                                        {student.supervisor ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-light text-success text-[10px] font-bold dark:bg-success/10">
                                                Assigned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-light text-warning text-[10px] font-bold dark:bg-warning/10">
                                                Unassigned
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-caption text-text-secondary dark:text-text-dark-secondary truncate">{student.email}</p>
                                    {student.matricNo && (
                                        <p className="flex items-center gap-1 text-caption text-text-tertiary dark:text-text-dark-tertiary mt-0.5">
                                            <GraduationCap size={12} /> {student.matricNo}
                                        </p>
                                    )}
                                    {student.companyName && (
                                        <p className="flex items-center gap-1 text-caption text-text-tertiary dark:text-text-dark-tertiary mt-0.5 truncate">
                                            <Buildings size={12} /> {student.companyName}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-caption font-medium text-primary flex items-center gap-1">
                                            <Notebook size={13} weight="duotone" /> {student.totalLogs} logs
                                        </span>
                                        {student.supervisor && (
                                            <span className="text-caption text-text-tertiary dark:text-text-dark-tertiary">
                                                Sup: {student.supervisor.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                            <span className="text-body text-text-secondary">Page {page} of {meta.totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
