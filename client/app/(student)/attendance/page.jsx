'use client';
import { useState, useEffect, useCallback } from 'react';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { AttendanceSkeleton } from '@/components/ui/Skeletons';
import clsx from 'clsx';
import {
    CalendarCheck,
    CaretLeft,
    CaretRight,
    Check,
    X as XIcon,
    Clock,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

const statusConfig = {
    present: { bg: 'bg-success', text: 'text-white', icon: Check, label: 'Present' },
    absent: { bg: 'bg-danger', text: 'text-white', icon: XIcon, label: 'Absent' },
    excused: { bg: 'bg-warning', text: 'text-white', icon: Clock, label: 'Excused' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AttendancePage() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);
    const [activeDay, setActiveDay] = useState(null);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/attendance', { params: { month, year } });
            setRecords(data.data.records);
            setSummary(data.data.summary);
        } catch {
            toast.error('Failed to load attendance');
        } finally {
            setLoading(false);
        }
    }, [month, year]);

    useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

    const handleMark = async (date, status) => {
        setMarking(date);
        try {
            await api.post('/attendance', {
                date: format(date, 'yyyy-MM-dd'),
                status,
            });
            toast.success(`Marked as ${status}`);
            fetchAttendance();
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to mark attendance');
        } finally {
            setMarking(null);
        }
    };

    const prevMonth = () => {
        if (month === 1) { setMonth(12); setYear(year - 1); }
        else setMonth(month - 1);
    };

    const nextMonth = () => {
        if (month === 12) { setMonth(1); setYear(year + 1); }
        else setMonth(month + 1);
    };

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));
    const firstDay = getDay(startOfMonth(new Date(year, month - 1)));
    const today = new Date();
    const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();

    const getRecordForDay = (day) => {
        const dateStr = format(new Date(year, month - 1, day), 'yyyy-MM-dd');
        return records.find((r) => format(new Date(r.date), 'yyyy-MM-dd') === dateStr);
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <CalendarCheck size={22} weight="duotone" className="text-primary" />
                </div>
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary">Attendance</h1>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">Track your daily attendance</p>
                </div>
            </div>

            {/* Summary cards */}
            {summary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Present', value: summary.present, color: 'text-success', bg: 'bg-success-light dark:bg-success/10' },
                        { label: 'Absent', value: summary.absent, color: 'text-danger', bg: 'bg-danger-light dark:bg-danger/10' },
                        { label: 'Excused', value: summary.excused, color: 'text-warning', bg: 'bg-warning-light dark:bg-warning/10' },
                        { label: 'Rate', value: `${summary.rate}%`, color: 'text-primary', bg: 'bg-primary-50 dark:bg-primary-900/20' },
                    ].map((stat) => (
                        <div key={stat.label} className={clsx('rounded-xl p-4 text-center', stat.bg)}>
                            <p className={clsx('text-2xl font-bold', stat.color)}>{stat.value}</p>
                            <p className="text-caption font-medium text-text-secondary dark:text-text-dark-secondary">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Calendar */}
            <div className="card p-5">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-5">
                    <button onClick={prevMonth} className="p-3 rounded-lg hover:bg-surface-muted dark:hover:bg-surface-dark-muted transition-colors">
                        <CaretLeft size={20} className="text-text-secondary" />
                    </button>
                    <h2 className="text-subheading text-text-primary dark:text-text-dark-primary">
                        {format(new Date(year, month - 1), 'MMMM yyyy')}
                    </h2>
                    <button onClick={nextMonth} disabled={new Date(year, month) >= new Date(today.getFullYear(), today.getMonth() + 1)} className="p-3 rounded-lg hover:bg-surface-muted dark:hover:bg-surface-dark-muted transition-colors disabled:opacity-30">
                        <CaretRight size={20} className="text-text-secondary" />
                    </button>
                </div>

                {loading ? (
                    <AttendanceSkeleton />
                ) : (
                    <>
                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {WEEKDAYS.map((d) => (
                                <div key={d} className="text-center text-caption font-semibold text-text-tertiary dark:text-text-dark-tertiary py-2">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty cells before first day */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dayDate = new Date(year, month - 1, day);
                                const isFuture = dayDate > today;
                                const isToday = day === today.getDate() && isCurrentMonth;
                                const record = getRecordForDay(day);
                                const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
                                const isMarking = marking && format(marking, 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd');
                                const isPast = !isFuture && !isToday;
                                const canMark = isToday;

                                return (
                                    <div
                                        key={day}
                                        onClick={() => canMark && setActiveDay(activeDay === day ? null : day)}
                                        className={clsx(
                                            'aspect-square rounded-xl flex flex-col items-center justify-center relative group transition-all duration-200',
                                            isFuture && 'opacity-30 cursor-not-allowed',
                                            isPast && !record && 'opacity-50',
                                            isToday && !record && 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface-dark',
                                            isWeekend && !record && 'bg-neutral-50 dark:bg-neutral-800/30',
                                            record && statusConfig[record.status]?.bg,
                                            record && statusConfig[record.status]?.text,
                                            canMark && !record && !isWeekend && 'bg-surface-muted dark:bg-surface-dark-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer',
                                            !canMark && !record && !isWeekend && !isFuture && 'bg-surface-muted dark:bg-surface-dark-muted',
                                        )}
                                    >
                                        <span className={clsx('text-body font-semibold', !record && 'text-text-primary dark:text-text-dark-primary')}>
                                            {day}
                                        </span>
                                        {record && (
                                            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                                                {record.status.slice(0, 3)}
                                            </span>
                                        )}

                                        {/* Quick-mark popover — only on today */}
                                        {canMark && !isMarking && (
                                            <div className={clsx(
                                                'absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full items-center gap-1 bg-surface-elevated dark:bg-surface-dark-elevated shadow-elevated rounded-lg p-1.5 z-10 animate-scale-in',
                                                activeDay === day ? 'flex' : 'hidden group-hover:flex'
                                            )}>
                                                {Object.entries(statusConfig).map(([status, cfg]) => {
                                                    const Icon = cfg.icon;
                                                    return (
                                                        <button
                                                            key={status}
                                                            onClick={(e) => { e.stopPropagation(); handleMark(dayDate, status); setActiveDay(null); }}
                                                            className={clsx('p-2.5 rounded-md transition-colors', cfg.bg, cfg.text, 'hover:opacity-80')}
                                                            title={cfg.label}
                                                            aria-label={`Mark ${cfg.label}`}
                                                        >
                                                            <Icon size={16} weight="bold" />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {isMarking && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/40 rounded-xl">
                                                <Spinner size={16} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                {Object.entries(statusConfig).map(([status, cfg]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div className={clsx('w-3 h-3 rounded-full', cfg.bg)} />
                        <span className="text-caption text-text-secondary dark:text-text-dark-secondary">{cfg.label}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full ring-2 ring-primary" />
                    <span className="text-caption text-text-secondary dark:text-text-dark-secondary">Today</span>
                </div>
            </div>
        </div>
    );
}
