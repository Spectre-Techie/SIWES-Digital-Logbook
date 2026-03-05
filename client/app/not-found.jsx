'use client';
import Link from 'next/link';
import { Compass, House } from '@phosphor-icons/react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark px-6">
            <div className="max-w-md w-full text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 mb-6">
                    <Compass size={32} weight="duotone" className="text-primary" />
                </div>

                <p className="text-6xl font-bold text-primary mb-2">404</p>

                <h1 className="text-heading text-text-primary dark:text-text-dark-primary mb-2">
                    Page not found
                </h1>
                <p className="text-body text-text-secondary dark:text-text-dark-secondary mb-8 leading-relaxed">
                    The page you are looking for does not exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-white font-semibold text-body hover:bg-primary-dark active:scale-[0.97] transition-all duration-200"
                >
                    <House size={16} weight="bold" /> Back to Home
                </Link>
            </div>
        </div>
    );
}
