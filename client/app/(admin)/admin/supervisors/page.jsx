'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { StudentListSkeleton } from '@/components/ui/Skeletons';
import Button from '@/components/ui/Button';
import {
    Users,
    MagnifyingGlass,
    Notebook,
    EnvelopeSimple,
} from '@phosphor-icons/react';

export default function AdminSupervisorsPage() {
    const [supervisors, setSupervisors] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(search);

    const fetchSupervisors = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, ...(debouncedSearch && { search: debouncedSearch }) };
            const { data } = await api.get('/admin/supervisors', { params });
            setSupervisors(data.data);
            setMeta(data.meta);
        } catch {
            // handled
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => { fetchSupervisors(); }, [fetchSupervisors]);

    if (loading && !supervisors.length) return <StudentListSkeleton />;

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <Users size={22} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-heading text-text-primary dark:text-text-dark-primary">Supervisors</h1>
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                            {meta ? `${meta.total} registered` : 'Loading...'}
                        </p>
                    </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchSupervisors(); }} className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-dark-elevated text-body placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <Button type="submit" size="sm">Search</Button>
                </form>
            </div>

            {/* List */}
            {supervisors.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users size={40} className="mx-auto text-text-tertiary mb-4" />
                    <h3 className="text-subheading text-text-primary dark:text-text-dark-primary mb-2">No supervisors found</h3>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                        {search ? 'Try a different search.' : 'No supervisors registered yet.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {supervisors.map((sup) => (
                            <div key={sup.id} className="card p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center flex-shrink-0">
                                        <span className="text-body font-bold text-white">
                                            {sup.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary truncate">
                                            {sup.name}
                                        </p>
                                        <p className="flex items-center gap-1 text-caption text-text-secondary dark:text-text-dark-secondary truncate">
                                            <EnvelopeSimple size={12} /> {sup.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-border dark:border-border-dark flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-body font-medium text-primary">
                                        <Notebook size={15} weight="duotone" /> {sup.studentCount} student{sup.studentCount !== 1 ? 's' : ''}
                                    </span>
                                    <span className="text-caption text-text-tertiary dark:text-text-dark-tertiary">
                                        {sup.studentCount === 0 ? 'Available' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

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
