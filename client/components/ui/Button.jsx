'use client';
import { forwardRef } from 'react';
import clsx from 'clsx';
import { CircleNotch } from '@phosphor-icons/react';

// Variant styles — uses only the unified design token palette
const variants = {
    // Primary action — violet brand
    primary: [
        'bg-primary text-white shadow-sm',
        'hover:bg-primary-dark hover:shadow-card',
        'focus:ring-primary/30',
    ],
    // Secondary / neutral — dark charcoal
    secondary: [
        'bg-neutral-800 text-white shadow-sm',
        'hover:bg-neutral-700 hover:shadow-card',
        'dark:bg-neutral-700 dark:hover:bg-neutral-600',
        'focus:ring-neutral-500/30',
    ],
    // Outlined — border only, transparent fill
    outline: [
        'border border-border bg-transparent text-text-primary',
        'hover:bg-neutral-100 hover:border-border-strong',
        'dark:border-border-dark dark:text-text-dark-primary',
        'dark:hover:bg-neutral-800 dark:hover:border-border-dark-strong',
        'focus:ring-primary/20',
    ],
    // Ghost — no border, subtle hover
    ghost: [
        'bg-transparent text-text-secondary',
        'hover:bg-neutral-100 hover:text-text-primary',
        'dark:text-text-dark-secondary dark:hover:bg-neutral-800 dark:hover:text-text-dark-primary',
        'focus:ring-primary/20',
    ],
    // Danger action
    danger: [
        'bg-danger text-white shadow-sm',
        'hover:bg-danger-dark hover:shadow-card',
        'focus:ring-danger/30',
    ],
    // Positive confirmation
    success: [
        'bg-success text-white shadow-sm',
        'hover:bg-success-dark hover:shadow-card',
        'focus:ring-success/30',
    ],
};

const sizes = {
    sm: 'h-8  px-3  text-caption  gap-1.5 rounded-lg',
    md: 'h-10 px-4  text-body     gap-2   rounded-xl',
    lg: 'h-11 px-5  text-body-lg  gap-2   rounded-xl',
};

const Button = forwardRef((
    { children, variant = 'primary', size = 'md', loading = false, disabled = false, className, type = 'button', ...props },
    ref
) => {
    const variantClasses = variants[variant] ?? variants.primary;
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={clsx(
                'inline-flex items-center justify-center font-semibold',
                'transition-all duration-200 active:scale-[0.98]',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                'dark:focus:ring-offset-surface-dark',
                variantClasses,
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && <CircleNotch size={14} weight="bold" className="animate-spin" aria-hidden="true" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';
export default Button;
