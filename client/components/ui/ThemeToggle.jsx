'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Desktop } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const themeOptions = [
    { value: 'system', icon: Desktop, label: 'System' },
    { value: 'light',  icon: Sun,     label: 'Light'  },
    { value: 'dark',   icon: Moon,    label: 'Dark'   },
];

export default function ThemeToggle({ className = '' }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className={`flex items-center gap-0.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${className}`}>
                {themeOptions.map(({ value, icon: Icon, label }) => (
                    <div key={value} className="flex items-center justify-center p-1.5 rounded-lg">
                        <Icon size={14} className="text-text-tertiary" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-0.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${className}`}>
            {themeOptions.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    aria-label={`${label} theme`}
                    className={clsx(
                        'flex items-center justify-center p-1.5 rounded-lg text-caption font-semibold transition-all duration-200',
                        theme === value
                            ? 'bg-surface-elevated text-primary shadow-sm dark:bg-surface-dark-elevated dark:text-primary-400'
                            : 'text-text-tertiary hover:text-text-secondary dark:text-text-dark-tertiary dark:hover:text-text-dark-secondary'
                    )}
                >
                    <Icon size={14} weight={theme === value ? 'fill' : 'regular'} />
                </button>
            ))}
        </div>
    );
}
