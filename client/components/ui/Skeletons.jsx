'use client';
import clsx from 'clsx';

function Bone({ className, ...props }) {
    return (
        <div
            className={clsx(
                'animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800',
                className
            )}
            {...props}
        />
    );
}

// ── Dashboard Skeleton ─────────────────────────────────────────────────────
export function DashboardSkeleton() {
    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="space-y-2">
                    <Bone className="h-7 w-56" />
                    <Bone className="h-4 w-40" />
                </div>
                <div className="flex gap-2">
                    <Bone className="h-10 w-28 rounded-xl" />
                    <Bone className="h-10 w-32 rounded-xl" />
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl p-4 bg-neutral-100 dark:bg-neutral-900/40">
                        <Bone className="h-5 w-5 mb-2 rounded-md" />
                        <Bone className="h-8 w-14 mb-1" />
                        <Bone className="h-3 w-20" />
                    </div>
                ))}
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[0, 1].map((col) => (
                    <div key={col} className="card p-5">
                        <Bone className="h-5 w-28 mb-4" />
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-muted dark:bg-surface-dark-muted">
                                    <Bone className="h-4 w-32" />
                                    <Bone className="h-5 w-16 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Log List Skeleton ──────────────────────────────────────────────────────
export function LogListSkeleton() {
    return (
        <div className="page-container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Bone className="w-10 h-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Bone className="h-6 w-32" />
                        <Bone className="h-3 w-24" />
                    </div>
                </div>
                <Bone className="h-10 w-28 rounded-xl" />
            </div>

            <div className="flex gap-2 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Bone key={i} className="h-8 w-20 rounded-lg" />
                ))}
            </div>

            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="card p-4 flex items-start gap-4">
                        <div className="min-w-[52px] text-center space-y-1">
                            <Bone className="h-7 w-8 mx-auto" />
                            <Bone className="h-3 w-8 mx-auto" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Bone className="h-4 w-3/4" />
                            <div className="flex gap-3">
                                <Bone className="h-3 w-16" />
                                <Bone className="h-3 w-24" />
                                <Bone className="h-5 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Log Detail Skeleton ────────────────────────────────────────────────────
export function LogDetailSkeleton() {
    return (
        <div className="page-container max-w-3xl">
            <Bone className="h-4 w-36 mb-6" />
            <div className="flex items-center gap-3 mb-6">
                <Bone className="h-7 w-64" />
                <Bone className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-4 mb-6">
                <Bone className="h-4 w-20" />
                <Bone className="h-4 w-28" />
                <Bone className="h-4 w-36" />
            </div>
            <div className="space-y-6">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="card p-5 space-y-2">
                        <Bone className="h-4 w-32" />
                        <Bone className="h-3 w-full" />
                        <Bone className="h-3 w-5/6" />
                        <Bone className="h-3 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Attendance Skeleton ────────────────────────────────────────────────────
export function AttendanceSkeleton() {
    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <Bone className="w-10 h-10 rounded-xl" />
                <div className="space-y-1.5">
                    <Bone className="h-6 w-28" />
                    <Bone className="h-3 w-40" />
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl p-4 bg-neutral-100 dark:bg-neutral-900/40 text-center">
                        <Bone className="h-8 w-10 mx-auto mb-1" />
                        <Bone className="h-3 w-14 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-5">
                    <Bone className="h-8 w-8 rounded-lg" />
                    <Bone className="h-5 w-36" />
                    <Bone className="h-8 w-8 rounded-lg" />
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Bone key={`hdr-${i}`} className="h-4 w-8 mx-auto mb-2" />
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => (
                        <Bone key={i} className="aspect-square rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Students List Skeleton ─────────────────────────────────────────────────
export function StudentListSkeleton() {
    return (
        <div className="page-container">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Bone className="w-10 h-10 rounded-xl" />
                    <div className="space-y-1.5">
                        <Bone className="h-6 w-28" />
                        <Bone className="h-3 w-36" />
                    </div>
                </div>
                <Bone className="h-10 w-52 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="card p-5 flex items-start gap-4">
                        <Bone className="w-11 h-11 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Bone className="h-4 w-40" />
                            <Bone className="h-3 w-32" />
                            <div className="flex gap-4">
                                <Bone className="h-3 w-16" />
                                <Bone className="h-3 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Table Skeleton ─────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 8, cols = 5 }) {
    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="grid gap-4 px-5 py-3 border-b border-border dark:border-border-dark bg-surface-muted dark:bg-surface-dark-muted" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                {Array.from({ length: cols }).map((_, i) => (
                    <Bone key={i} className="h-3 w-20" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="grid gap-4 px-5 py-3 border-b border-border/50 dark:border-border-dark/50 last:border-none" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                    {Array.from({ length: cols }).map((_, c) => (
                        <Bone key={c} className="h-4 w-full" />
                    ))}
                </div>
            ))}
        </div>
    );
}

// ── Stat Card Skeleton ─────────────────────────────────────────────────────
export function StatCardsSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="card p-5 bg-neutral-50 dark:bg-neutral-900/40 border-none">
                    <Bone className="h-6 w-6 rounded-md mb-2" />
                    <Bone className="h-8 w-16 mb-1" />
                    <Bone className="h-3 w-20 mt-1" />
                </div>
            ))}
        </div>
    );
}

export { Bone };
