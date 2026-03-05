'use client';
import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, type = 'text', className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="block text-body font-medium text-text-primary dark:text-text-dark-primary">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                type={type}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={clsx(
                    'w-full rounded-xl border bg-surface-elevated px-4 py-2.5 text-body text-text-primary placeholder:text-text-tertiary shadow-input transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    'dark:bg-surface-dark-elevated dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error
                        ? 'border-danger focus:ring-danger/20 focus:border-danger'
                        : 'border-border dark:border-border-dark',
                    className
                )}
                {...props}
            />
            {error && (
                <p id={`${inputId}-error`} role="alert" className="text-caption text-danger font-medium">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
