'use client';
import { forwardRef, useState } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(({ label, error, rows = 4, maxLength, className, id, ...props }, ref) => {
    const [charCount, setCharCount] = useState(props.defaultValue?.length || 0);
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const handleChange = (e) => {
        setCharCount(e.target.value.length);
        if (props.onChange) props.onChange(e);
    };

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={textareaId} className="block text-body font-medium text-text-primary dark:text-text-dark-primary">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                aria-invalid={error ? 'true' : undefined}
                aria-describedby={error ? `${textareaId}-error` : undefined}
                className={clsx(
                    'w-full rounded-xl border bg-surface-elevated px-4 py-2.5 text-body text-text-primary placeholder:text-text-tertiary shadow-input transition-all duration-200 resize-y',
                    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                    'dark:bg-surface-dark-elevated dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    error
                        ? 'border-danger focus:ring-danger/20 focus:border-danger'
                        : 'border-border dark:border-border-dark',
                    className
                )}
                {...props}
                onChange={handleChange}
            />
            <div className="flex justify-between">
                {error && <p id={`${textareaId}-error`} role="alert" className="text-caption text-danger font-medium">{error}</p>}
                {maxLength && (
                    <p className={clsx('text-caption ml-auto', charCount > maxLength ? 'text-danger' : 'text-text-tertiary dark:text-text-dark-tertiary')}>
                        {charCount}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
});

Textarea.displayName = 'Textarea';
export default Textarea;
