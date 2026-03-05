'use client';
import { forwardRef } from 'react';
import clsx from 'clsx';
import { CaretDown } from '@phosphor-icons/react';

const Select = forwardRef(({ label, error, options = [], placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={selectId} className="block text-body font-medium text-text-primary dark:text-text-dark-primary">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={error ? 'true' : undefined}
                    aria-describedby={error ? `${selectId}-error` : undefined}
                    className={clsx(
                        'w-full appearance-none rounded-xl border bg-surface-elevated px-4 py-2.5 pr-10 text-body text-text-primary shadow-input transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                        'dark:bg-surface-dark-elevated dark:text-text-dark-primary dark:border-border-dark',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error ? 'border-danger' : 'border-border',
                        className
                    )}
                    {...props}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <CaretDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-dark-tertiary pointer-events-none" />
            </div>
            {error && <p id={`${selectId}-error`} role="alert" className="text-caption text-danger font-medium">{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';
export default Select;
