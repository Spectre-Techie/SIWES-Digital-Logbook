'use client';
import { CircleNotch } from '@phosphor-icons/react';
import clsx from 'clsx';

export default function Spinner({ size = 24, fullPage = false, className }) {
    if (fullPage) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center gap-3">
                    <CircleNotch size={40} className="animate-spin text-primary" />
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx('flex items-center justify-center py-8', className)}>
            <CircleNotch size={size} className="animate-spin text-primary" />
        </div>
    );
}
