'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLogs } from '@/hooks/useLogs';
import LogCard from '@/components/logs/LogCard';
import Button from '@/components/ui/Button';
import { LogListSkeleton } from '@/components/ui/Skeletons';
import { Plus, FunnelSimple, Notebook } from '@phosphor-icons/react';
import clsx from 'clsx';

const statusFilters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

export default function LogsListPage() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const { logs, meta, loading, error } = useLogs({ page, status: status || undefined });

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                        <Notebook size={22} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-heading text-text-primary dark:text-text-dark-primary">
                            Log History
                        </h1>
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                            {meta ? `${meta.total} total entries` : 'Loading...'}
                        </p>
                    </div>
                </div>
                <Link href="/logs/new">
                    <Button size="md">
                        <Plus size={16} weight="bold" /> New Entry
                    </Button>
                </Link>
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                <FunnelSimple size={16} className="text-text-tertiary flex-shrink-0" />
                {statusFilters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => { setStatus(f.value); setPage(1); }}
                        className={clsx(
                            'px-3 py-1.5 rounded-lg text-caption font-semibold whitespace-nowrap transition-all duration-200',
                            status === f.value
                                ? 'bg-neutral-800 text-white dark:bg-neutral-700 dark:text-white'
                                : 'bg-surface-muted text-text-secondary hover:bg-neutral-200 dark:bg-surface-dark-elevated dark:text-text-dark-secondary dark:hover:bg-surface-dark-muted'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <LogListSkeleton />
            ) : error ? (
                <div className="card p-8 text-center">
                    <p className="text-body text-danger">{error}</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                        <Notebook size={32} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-subheading text-text-primary dark:text-text-dark-primary mb-2">
                        No log entries yet
                    </h3>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary mb-6">
                        {status ? `No ${status} log entries found.` : 'Start by creating your first daily log entry.'}
                    </p>
                    {!status && (
                        <Link href="/logs/new">
                            <Button>
                                <Plus size={16} weight="bold" /> Create First Entry
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {logs.map((log) => (
                            <LogCard key={log.id} log={log} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>
                            <span className="text-body text-text-secondary dark:text-text-dark-secondary">
                                Page {page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= meta.totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
