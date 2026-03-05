'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { StudentListSkeleton } from '@/components/ui/Skeletons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Users, MagnifyingGlass, Notebook, CalendarCheck, CaretRight, Buildings } from '@phosphor-icons/react';

export default function SupervisorStudentsPage() {
    const [students, setStudents] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/supervisor/students', {
                params: { page, ...(debouncedSearch && { search: debouncedSearch }) },
            });
            setStudents(data.data);
            setMeta(data.meta);
        } catch {
            // handled
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchStudents();
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <Users size={22} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-heading text-text-primary dark:text-text-dark-primary">My Students</h1>
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                            {meta ? `${meta.total} student${meta.total !== 1 ? 's' : ''} assigned` : 'Loading...'}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-dark-elevated text-body placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                </form>
            </div>

            {/* Students list */}
            {loading ? (
                <StudentListSkeleton />
            ) : students.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users size={40} className="mx-auto text-text-tertiary mb-4" />
                    <h3 className="text-subheading text-text-primary dark:text-text-dark-primary mb-2">No students found</h3>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                        {search ? 'Try a different search term.' : 'No students have been assigned to you yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map((student) => (
                            <Link
                                key={student.id}
                                href={`/supervisor/students/${student.id}`}
                                className="group"
                            >
                                <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-200">
                                    {/* Avatar */}
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                                        <span className="text-body font-bold text-white">
                                            {student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary truncate">
                                                {student.name}
                                            </p>
                                            <CaretRight size={16} className="flex-shrink-0 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-caption text-text-secondary dark:text-text-dark-secondary truncate">{student.email}</p>
                                        {student.companyName && (
                                            <p className="flex items-center gap-1 text-caption text-text-tertiary dark:text-text-dark-tertiary mt-1 truncate">
                                                <Buildings size={12} /> {student.companyName}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1 text-caption font-medium text-primary">
                                                <Notebook size={13} weight="duotone" /> {student.totalLogs} logs
                                            </span>
                                            <span className="flex items-center gap-1 text-caption font-medium text-warning">
                                                <CalendarCheck size={13} weight="duotone" /> {student.totalAttendance} days
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                            <span className="text-body text-text-secondary">Page {page} of {meta.totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
