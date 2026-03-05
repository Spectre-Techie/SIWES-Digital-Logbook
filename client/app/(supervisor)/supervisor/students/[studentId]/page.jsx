'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { LogListSkeleton } from '@/components/ui/Skeletons';
import StatusBadge from '@/components/logs/StatusBadge';
import clsx from 'clsx';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    Notebook,
    Buildings,
    Checks,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function StudentReviewPage() {
    const { studentId } = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [rejectingLog, setRejectingLog] = useState(null);
    const [rejectComment, setRejectComment] = useState('');
    const [approvingLog, setApprovingLog] = useState(null);
    const [approveComment, setApproveComment] = useState('');
    const [processingId, setProcessingId] = useState(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const { data: res } = await api.get(`/supervisor/students/${studentId}/logs`, {
                params: { page, ...(status && { status }) },
            });
            setData(res.data);
        } catch {
            toast.error('Failed to load student logs');
            router.push('/supervisor/students');
        } finally {
            setLoading(false);
        }
    }, [studentId, page, status, router]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const handleApprove = async () => {
        setProcessingId(approvingLog);
        try {
            await api.put(`/supervisor/logs/${approvingLog}/approve`, {
                comment: approveComment.trim() || undefined,
            });
            toast.success('Log approved');
            setApprovingLog(null);
            setApproveComment('');
            fetchLogs();
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to approve');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (rejectComment.trim().length < 5) {
            toast.error('Please provide a reason (min 5 characters)');
            return;
        }
        setProcessingId(rejectingLog);
        try {
            await api.put(`/supervisor/logs/${rejectingLog}/reject`, { comment: rejectComment });
            toast.success('Log rejected with feedback');
            setRejectingLog(null);
            setRejectComment('');
            fetchLogs();
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to reject');
        } finally {
            setProcessingId(null);
        }
    };

    const handleBulkApprove = async () => {
        try {
            const { data: res } = await api.post('/supervisor/logs/bulk-approve', { logIds: selectedLogs });
            toast.success(`${res.data.approved} logs approved`);
            setSelectedLogs([]);
            fetchLogs();
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Bulk approve failed');
        }
    };

    const toggleSelect = (logId) => {
        setSelectedLogs((prev) =>
            prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]
        );
    };

    const toggleSelectAll = () => {
        if (!data?.data) return;
        const pendingIds = data.data.filter((l) => l.status === 'pending').map((l) => l.id);
        setSelectedLogs((prev) =>
            prev.length === pendingIds.length ? [] : pendingIds
        );
    };

    const statusFilters = [
        { value: '', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ];

    const pendingCount = data?.data?.filter((l) => l.status === 'pending').length || 0;

    return (
        <div className="page-container">
            {/* Back */}
            <button onClick={() => router.push('/supervisor/students')} className="flex items-center gap-2 text-body font-medium text-text-secondary hover:text-text-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary transition-colors mb-6">
                <ArrowLeft size={16} /> Back to Students
            </button>

            {loading && !data ? (
                <LogListSkeleton />
            ) : data ? (
                <>
                    {/* Student Info Header */}
                    <div className="card p-5 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                                <span className="text-subheading font-bold text-white">
                                    {data.student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-heading text-text-primary dark:text-text-dark-primary">{data.student.name}</h1>
                                <div className="flex items-center gap-3 mt-1 text-caption text-text-secondary dark:text-text-dark-secondary">
                                    {data.student.companyName && (
                                        <span className="flex items-center gap-1"><Buildings size={13} /> {data.student.companyName}</span>
                                    )}
                                    <span className="flex items-center gap-1"><Notebook size={13} /> {data.meta.total} total logs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bulk approve bar */}
                    {selectedLogs.length > 0 && (
                        <div className="flex items-center justify-between gap-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl px-4 py-3 mb-4 animate-slide-up">
                            <p className="text-body font-medium text-primary-800 dark:text-primary-200">
                                {selectedLogs.length} log{selectedLogs.length > 1 ? 's' : ''} selected
                            </p>
                            <Button size="sm" onClick={handleBulkApprove}>
                                <Checks size={16} weight="bold" /> Approve All
                            </Button>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {statusFilters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => { setStatus(f.value); setPage(1); setSelectedLogs([]); }}
                                    className={clsx(
                                        'px-3 py-1.5 rounded-lg text-caption font-semibold whitespace-nowrap transition-all',
                                        status === f.value
                                            ? 'bg-neutral-800 text-white'
                                            : 'bg-surface-muted text-text-secondary hover:bg-neutral-200 dark:bg-surface-dark-elevated dark:text-text-dark-secondary'
                                    )}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        {pendingCount > 0 && (
                            <button
                                onClick={toggleSelectAll}
                                className="text-caption font-medium text-primary hover:text-primary-dark transition-colors whitespace-nowrap"
                            >
                                {selectedLogs.length === pendingCount ? 'Deselect All' : 'Select All Pending'}
                            </button>
                        )}
                    </div>

                    {/* Logs */}
                    {loading ? (
                        <LogListSkeleton />
                    ) : data.data.length === 0 ? (
                        <div className="card p-12 text-center">
                            <Notebook size={40} className="mx-auto text-text-tertiary mb-3" />
                            <p className="text-body text-text-secondary">No log entries found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.data.map((log) => (
                                <div key={log.id} className="card p-4">
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox for pending logs */}
                                        {log.status === 'pending' && (
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.includes(log.id)}
                                                onChange={() => toggleSelect(log.id)}
                                                className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer accent-primary"
                                            />
                                        )}

                                        {/* Log content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary">
                                                        {format(new Date(log.date), 'EEE, MMM d yyyy')}
                                                    </p>
                                                    <StatusBadge status={log.status} />
                                                </div>
                                                <div className="flex items-center gap-2 text-caption text-text-secondary">
                                                    <span className="flex items-center gap-1"><Clock size={13} className="text-primary-400" /> {log.hours}hrs</span>
                                                    {log.department && <span className="flex items-center gap-1"><MapPin size={13} className="text-neutral-400" /> {log.department}</span>}
                                                </div>
                                            </div>
                                            <p className="text-body text-text-secondary dark:text-text-dark-secondary line-clamp-2 mb-3">
                                                {log.tasks}
                                            </p>

                                            {/* Actions for pending logs */}
                                            {log.status === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => { setApprovingLog(log.id); setApproveComment(''); setRejectingLog(null); }}
                                                        disabled={!!processingId}
                                                    >
                                                        <CheckCircle size={14} weight="fill" /> Approve
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => { setRejectingLog(log.id); setRejectComment(''); setApprovingLog(null); }}
                                                        disabled={!!processingId}
                                                    >
                                                        <XCircle size={14} weight="fill" /> Reject
                                                    </Button>
                                                </div>
                                            )}

                                            {/* Supervisor comment */}
                                            {log.supervisorComment && (
                                                <div className={clsx(
                                                    'mt-2 px-3 py-2 rounded-lg text-caption',
                                                    log.status === 'approved' ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300' : 'bg-danger-light text-danger-dark dark:bg-danger/10 dark:text-danger'
                                                )}>
                                                    <strong>Your comment:</strong> {log.supervisorComment}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Inline approve comment */}
                                    {approvingLog === log.id && (
                                        <div className="mt-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 animate-slide-down">
                                            <p className="text-body font-semibold text-primary-800 dark:text-primary-200 mb-2">Approval Comment (optional)</p>
                                            <textarea
                                                value={approveComment}
                                                onChange={(e) => setApproveComment(e.target.value)}
                                                placeholder="Leave a comment or feedback for the student..."
                                                rows={2}
                                                className="w-full rounded-lg border border-primary-200 dark:border-primary-700 bg-white dark:bg-surface-dark-elevated px-3 py-2 text-body placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                            />
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button size="sm" onClick={handleApprove} loading={processingId === log.id}>
                                                    <CheckCircle size={14} weight="fill" /> Confirm Approval
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setApprovingLog(null)}>Cancel</Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inline reject modal */}
                                    {rejectingLog === log.id && (
                                        <div className="mt-3 p-4 bg-danger-light dark:bg-danger/10 rounded-xl border border-danger/40 dark:border-danger/30 animate-slide-down">
                                            <p className="text-body font-semibold text-danger-dark dark:text-danger mb-2">Rejection Reason</p>
                                            <textarea
                                                value={rejectComment}
                                                onChange={(e) => setRejectComment(e.target.value)}
                                                placeholder="Explain why this log entry is being rejected..."
                                                rows={3}
                                                className="w-full rounded-lg border border-danger/40 dark:border-danger/30 bg-white dark:bg-surface-dark-elevated px-3 py-2 text-body placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-danger/20 resize-none"
                                            />
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button size="sm" variant="danger" onClick={handleReject} loading={processingId === log.id}>
                                                    Submit Rejection
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setRejectingLog(null)}>Cancel</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {data.meta.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                            <span className="text-body text-text-secondary">Page {page} of {data.meta.totalPages}</span>
                            <Button variant="outline" size="sm" disabled={page >= data.meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    )}
                </>
            ) : null}
        </div>
    );
}
