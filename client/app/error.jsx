'use client';
import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { WarningOctagon, ArrowCounterClockwise } from '@phosphor-icons/react';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        // Optionally log to an error reporting service
        console.error('[GlobalError]', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark px-6">
            <div className="max-w-md w-full text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-light dark:bg-danger/10 mb-6">
                    <WarningOctagon size={32} weight="duotone" className="text-danger" />
                </div>

                <h1 className="text-heading text-text-primary dark:text-text-dark-primary mb-2">
                    Something went wrong
                </h1>
                <p className="text-body text-text-secondary dark:text-text-dark-secondary mb-8 leading-relaxed">
                    An unexpected error occurred. Please try again or navigate back to the dashboard.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button onClick={reset}>
                        <ArrowCounterClockwise size={16} weight="bold" /> Try Again
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        Go to Home
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && error?.message && (
                    <details className="mt-8 text-left">
                        <summary className="text-caption font-semibold text-text-tertiary dark:text-text-dark-tertiary cursor-pointer hover:text-text-secondary transition-colors">
                            Error details
                        </summary>
                        <pre className="mt-2 p-4 rounded-xl bg-surface-muted dark:bg-surface-dark-muted text-caption text-danger overflow-x-auto whitespace-pre-wrap break-words">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}
