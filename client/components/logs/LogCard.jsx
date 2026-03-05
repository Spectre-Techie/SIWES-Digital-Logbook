import { format } from 'date-fns';
import Link from 'next/link';
import { Clock, MapPin, CaretRight, WarningCircle } from '@phosphor-icons/react';
import StatusBadge from './StatusBadge';

export default function LogCard({ log }) {
    return (
        <Link href={`/logs/${log.id}`} className="group block">
            <div className="relative flex items-start gap-4 rounded-2xl border border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-dark-elevated p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-border-strong dark:hover:border-border-dark-strong">
                {/* Status indicator strip — left edge */}
                <div
                    className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${
                        log.status === 'approved' ? 'bg-success' :
                        log.status === 'rejected' ? 'bg-danger'  : 'bg-warning'
                    }`}
                />

                {/* Date column */}
                <div className="ml-3 min-w-[52px] text-center flex-shrink-0 pt-0.5">
                    <p className="text-xl font-bold text-text-primary dark:text-text-dark-primary leading-tight">
                        {format(new Date(log.date), 'd')}
                    </p>
                    <p className="text-caption font-semibold uppercase tracking-wide text-text-secondary dark:text-text-dark-secondary">
                        {format(new Date(log.date), 'MMM')}
                    </p>
                    <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary">
                        {format(new Date(log.date), 'yyyy')}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary line-clamp-2">
                            {(log.tasks || '').substring(0, 100)}{(log.tasks || '').length > 100 ? '...' : ''}
                        </p>
                        <CaretRight
                            size={15}
                            weight="bold"
                            className="flex-shrink-0 mt-0.5 text-text-tertiary transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-caption text-text-secondary dark:text-text-dark-secondary">
                            <Clock size={12} weight="duotone" className="text-primary-400" /> {log.hours} hrs
                        </span>
                        {log.department && (
                            <span className="flex items-center gap-1 text-caption text-text-secondary dark:text-text-dark-secondary">
                                <MapPin size={12} weight="duotone" className="text-neutral-400" /> {log.department}
                            </span>
                        )}
                        <StatusBadge status={log.status} />
                    </div>

                    {/* Late entry alert */}
                    {log.isLate && log.status === 'pending' && (
                        <p className="mt-2 flex items-center gap-1.5 text-caption font-medium text-warning">
                            <WarningCircle size={13} weight="fill" /> Late entry — pending review
                        </p>
                    )}

                    {/* Supervisor comment on rejected */}
                    {log.status === 'rejected' && log.supervisorComment && (
                        <p className="mt-2 text-caption text-danger line-clamp-1">
                            Feedback: {log.supervisorComment}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
