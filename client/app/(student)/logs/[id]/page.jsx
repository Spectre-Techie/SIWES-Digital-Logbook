'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import api from '@/lib/api';
import LogForm from '@/components/logs/LogForm';
import StatusBadge from '@/components/logs/StatusBadge';
import Button from '@/components/ui/Button';
import { LogDetailSkeleton } from '@/components/ui/Skeletons';
import { useLogs } from '@/hooks/useLogs';
import { ArrowLeft, PencilSimple, Trash, Clock, MapPin, CalendarBlank, ChatCircleText } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function LogDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [log, setLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { updateLog, deleteLog } = useLogs();

    useEffect(() => {
        const fetchLog = async () => {
            try {
                const { data } = await api.get(`/logs/${id}`);
                setLog(data.data);
            } catch (err) {
                toast.error('Failed to load log entry');
                router.push('/logs');
            } finally {
                setLoading(false);
            }
        };
        fetchLog();
    }, [id, router]);

    const handleUpdate = async (data) => {
        setSubmitting(true);
        try {
            const updated = await updateLog(id, data);
            setLog(updated);
            setEditing(false);
        } catch {
            // Handled in hook
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this log entry?')) return;
        try {
            await deleteLog(id);
            router.push('/logs');
        } catch {
            // Handled in hook
        }
    };

    if (loading) return <LogDetailSkeleton />;
    if (!log) return null;

    const canEdit = log.status !== 'approved';

    return (
        <div className="page-container max-w-3xl">
            {/* Back button */}
            <button
                onClick={() => router.push('/logs')}
                className="flex items-center gap-2 text-body font-medium text-text-secondary hover:text-text-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary transition-colors mb-6"
            >
                <ArrowLeft size={16} /> Back to Log History
            </button>

            {editing ? (
                /* Edit mode */
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary mb-6">
                        Edit Log Entry
                    </h1>
                    <div className="card p-6">
                        <LogForm
                            onSubmit={handleUpdate}
                            defaultValues={log}
                            isSubmitting={submitting}
                            isEdit
                        />
                    </div>
                </div>
            ) : (
                /* View mode */
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                                <h1 className="text-subheading sm:text-heading text-text-primary dark:text-text-dark-primary">
                                    {format(new Date(log.date), 'EEEE, MMMM d, yyyy')}
                                </h1>
                                <StatusBadge status={log.status} size="md" />
                            </div>
                        </div>
                        {canEdit && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                                    <PencilSimple size={14} /> Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={handleDelete}>
                                    <Trash size={14} /> Delete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-body text-text-secondary dark:text-text-dark-secondary">
                        <span className="flex items-center gap-1.5">
                            <Clock size={16} weight="duotone" className="text-primary-400" /> {log.hours} hours
                        </span>
                        {log.department && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={16} weight="duotone" className="text-neutral-400" /> {log.department}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <CalendarBlank size={16} weight="duotone" className="text-neutral-400" />
                            Created {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                        </span>
                    </div>

                    {/* Supervisor comment */}
                    {log.supervisorComment && (
                        <div className={`flex items-start gap-3 rounded-xl border p-4 mb-6 ${
                            log.status === 'rejected'
                                ? 'border-danger/40 bg-danger-light dark:bg-danger/10 dark:border-danger/30'
                                : 'border-primary/30 bg-primary-50 dark:bg-primary-900/15 dark:border-primary/20'
                        }`}>
                            <ChatCircleText size={20} weight="duotone" className={`flex-shrink-0 mt-0.5 ${
                                log.status === 'rejected' ? 'text-danger' : 'text-primary'
                            }`} />
                            <div>
                                <p className={`text-body font-semibold ${
                                    log.status === 'rejected'
                                        ? 'text-danger-dark dark:text-danger'
                                        : 'text-primary-800 dark:text-primary-300'
                                }`}>
                                    Supervisor Feedback
                                </p>
                                <p className={`text-body mt-1 ${
                                    log.status === 'rejected'
                                        ? 'text-danger dark:text-danger-light'
                                        : 'text-primary-700 dark:text-primary-200'
                                }`}>
                                    {log.supervisorComment}
                                </p>
                                {log.status === 'rejected' && (
                                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setEditing(true)}>
                                        <PencilSimple size={14} /> Edit &amp; Resubmit
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content sections */}
                    <div className="space-y-6">
                        <div className="card p-5">
                            <h3 className="text-body font-semibold text-text-primary dark:text-text-dark-primary mb-2">
                                Tasks Performed
                            </h3>
                            <p className="text-body text-text-secondary dark:text-text-dark-secondary whitespace-pre-wrap leading-relaxed">
                                {log.tasks}
                            </p>
                        </div>

                        {log.challenges && (
                            <div className="card p-5">
                                <h3 className="text-body font-semibold text-warning-dark dark:text-warning mb-2">
                                    Challenges Faced
                                </h3>
                                <p className="text-body text-text-secondary dark:text-text-dark-secondary whitespace-pre-wrap leading-relaxed">
                                    {log.challenges}
                                </p>
                            </div>
                        )}

                        {log.lessons && (
                            <div className="card p-5">
                                <h3 className="text-body font-semibold text-success-dark dark:text-success mb-2">
                                    Lessons Learned
                                </h3>
                                <p className="text-body text-text-secondary dark:text-text-dark-secondary whitespace-pre-wrap leading-relaxed">
                                    {log.lessons}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
