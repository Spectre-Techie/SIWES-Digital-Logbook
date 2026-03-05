'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
    BookOpenText,
    Notebook,
    CalendarCheck,
    ChartBar,
    ShieldCheck,
    CloudArrowUp,
    UsersFour,
    ArrowRight,
    CheckCircle,
    List,
    X,
    FileText,
    ClockCountdown,
    Checks,
} from '@phosphor-icons/react';

// ── Data ───────────────────────────────────────────────────────────────────

const features = [
    {
        icon: Notebook,
        title: 'Log Entries',
        description: 'Record daily tasks, challenges, and lessons with structured forms and time tracking.',
    },
    {
        icon: CalendarCheck,
        title: 'Attendance',
        description: 'Mark daily attendance with an interactive calendar. Present, absent, or excused.',
    },
    {
        icon: ShieldCheck,
        title: 'Supervisor Review',
        description: 'Supervisors review entries, leave comments, and approve or request changes.',
    },
    {
        icon: ChartBar,
        title: 'Progress Analytics',
        description: 'Track approval rates, total hours, and attendance in a real-time dashboard.',
    },
    {
        icon: CloudArrowUp,
        title: 'PDF Export',
        description: 'Generate a formatted PDF logbook ready for institutional submission.',
    },
    {
        icon: UsersFour,
        title: 'Admin Panel',
        description: 'Faculty admins manage students, supervisors, and assignments centrally.',
    },
];

const workflow = [
    {
        num: '1',
        title: 'Sign up',
        description: 'Create your account as a student, supervisor, or faculty admin.',
    },
    {
        num: '2',
        title: 'Log activities',
        description: 'Record daily tasks, challenges, and lessons during your placement.',
    },
    {
        num: '3',
        title: 'Get reviewed',
        description: 'Your supervisor reviews entries and provides approval or feedback.',
    },
    {
        num: '4',
        title: 'Export & submit',
        description: 'Download a professional PDF logbook for your institution.',
    },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary">
            {/* Skip link */}
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-primary focus:text-white focus:font-semibold"
            >
                Skip to main content
            </a>

            {/* ── Navbar ────────────────────────────────────────────── */}
            <nav
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-surface-elevated/80 dark:bg-surface-dark-elevated/80 backdrop-blur-xl border-b border-border/60 dark:border-border-dark/60'
                        : 'bg-transparent'
                }`}
            >
                <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5 sm:px-8">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <BookOpenText size={16} weight="duotone" className="text-white" />
                        </div>
                        <span className="text-body-lg font-bold">SIWES Logbook</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-1 text-body font-medium text-text-secondary dark:text-text-dark-secondary">
                        <a href="#features" className="px-3 py-1.5 rounded-lg hover:text-text-primary dark:hover:text-text-dark-primary transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="px-3 py-1.5 rounded-lg hover:text-text-primary dark:hover:text-text-dark-primary transition-colors">
                            How It Works
                        </a>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-body font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-body font-semibold bg-primary text-white hover:bg-primary-dark transition-all active:scale-[0.97]"
                        >
                            Get Started
                            <ArrowRight size={14} weight="bold" />
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={18} /> : <List size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-surface-elevated dark:bg-surface-dark-elevated border-t border-border dark:border-border-dark">
                        <div className="px-5 py-4 space-y-1">
                            <a
                                href="#features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-xl text-body font-medium text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-xl text-body font-medium text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            >
                                How It Works
                            </a>
                            <div className="pt-3 border-t border-border dark:border-border-dark flex gap-2">
                                <Link href="/login" className="flex-1 text-center py-2.5 rounded-xl text-body font-semibold border border-border dark:border-border-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/register" className="flex-1 text-center py-2.5 rounded-xl text-body font-semibold bg-primary text-white hover:bg-primary-dark transition-colors">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Main ──────────────────────────────────────────────── */}
            <main id="main">
                {/* ─ Hero ─ */}
                <section className="pt-32 sm:pt-40 pb-24 sm:pb-32 px-5 sm:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border dark:border-border-dark text-caption font-semibold text-text-secondary dark:text-text-dark-secondary mb-8">
                            <CheckCircle size={14} weight="fill" className="text-success" />
                            Built for SIWES students &amp; supervisors
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                            Track your industrial
                            <br className="hidden sm:block" />
                            {' '}training{' '}
                            <span className="text-primary">digitally</span>
                        </h1>

                        <p className="max-w-xl mx-auto text-body-lg text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-10">
                            Replace paper logbooks with a modern platform. Log daily activities, mark attendance, get supervisor feedback, and export professional reports.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-semibold text-body-lg hover:bg-primary-dark shadow-sm transition-all active:scale-[0.97]"
                            >
                                Create Free Account
                                <ArrowRight size={16} weight="bold" />
                            </Link>
                            <Link
                                href="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-border dark:border-border-dark font-semibold text-body-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard preview */}
                    <div className="max-w-4xl mx-auto mt-20">
                        <div className="rounded-2xl border border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-dark-elevated shadow-card overflow-hidden">
                            {/* Window chrome */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border dark:border-border-dark bg-surface-muted/60 dark:bg-surface-dark-muted/60">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-6 py-1 rounded-md bg-surface-elevated dark:bg-surface-dark-elevated border border-border dark:border-border-dark text-caption text-text-tertiary dark:text-text-dark-tertiary">
                                        siwes-logbook.app/dashboard
                                    </div>
                                </div>
                                <div className="w-12" />
                            </div>

                            {/* Dashboard content preview */}
                            <div className="p-5 sm:p-8">
                                <div className="mb-6">
                                    <p className="text-heading font-bold mb-1">Welcome back, Imran</p>
                                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">Here&apos;s your training progress overview</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {[
                                        { label: 'Total Entries', value: '24', color: 'text-primary' },
                                        { label: 'Hours Logged', value: '186', color: 'text-success' },
                                        { label: 'Approved', value: '21', color: 'text-success' },
                                        { label: 'Attendance', value: '96%', color: 'text-primary' },
                                    ].map((s) => (
                                        <div key={s.label} className="rounded-xl bg-surface-muted dark:bg-surface-dark-muted p-3.5">
                                            <p className={`text-heading font-bold ${s.color}`}>{s.value}</p>
                                            <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    {[
                                        { title: 'Set up development environment and tools', status: 'approved', date: 'Mon, Feb 24' },
                                        { title: 'Implemented user authentication module', status: 'approved', date: 'Tue, Feb 25' },
                                        { title: 'Designed database schema for inventory', status: 'pending', date: 'Wed, Feb 26' },
                                    ].map((entry) => (
                                        <div key={entry.title} className="flex items-center justify-between gap-3 rounded-xl border border-border dark:border-border-dark p-3.5">
                                            <div className="min-w-0">
                                                <p className="text-body font-semibold truncate">{entry.title}</p>
                                                <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary mt-0.5">{entry.date}</p>
                                            </div>
                                            <span
                                                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                                                    entry.status === 'approved'
                                                        ? 'bg-success-light text-success dark:bg-success/10'
                                                        : 'bg-warning-light text-warning dark:bg-warning/10'
                                                }`}
                                            >
                                                {entry.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─ Features ─ */}
                <section id="features" className="py-24 sm:py-32 border-t border-border dark:border-border-dark">
                    <div className="max-w-6xl mx-auto px-5 sm:px-8">
                        <div className="max-w-2xl mb-14">
                            <p className="text-caption font-bold text-primary uppercase tracking-widest mb-3">Features</p>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                Everything you need for SIWES documentation
                            </h2>
                            <p className="text-body-lg text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                                A complete system to replace paper logbooks. Built for students, supervisors, and faculty administrators.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border dark:bg-border-dark border border-border dark:border-border-dark rounded-2xl overflow-hidden">
                            {features.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div
                                        key={f.title}
                                        className="bg-surface-elevated dark:bg-surface-dark-elevated p-7 sm:p-8"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                                            <Icon size={20} weight="duotone" className="text-primary" />
                                        </div>
                                        <h3 className="text-body-lg font-semibold mb-2">{f.title}</h3>
                                        <p className="text-body text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                                            {f.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ─ How It Works ─ */}
                <section
                    id="how-it-works"
                    className="py-24 sm:py-32 bg-surface-muted/50 dark:bg-surface-dark-muted/50 border-t border-border dark:border-border-dark"
                >
                    <div className="max-w-6xl mx-auto px-5 sm:px-8">
                        <div className="max-w-2xl mb-14">
                            <p className="text-caption font-bold text-primary uppercase tracking-widest mb-3">How It Works</p>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                                Get started in four steps
                            </h2>
                            <p className="text-body-lg text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                                From registration to submission, the entire SIWES documentation process simplified.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
                            {workflow.map((step) => (
                                <div key={step.num}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="w-8 h-8 rounded-lg bg-primary text-white text-caption font-bold flex items-center justify-center flex-shrink-0">
                                            {step.num}
                                        </span>
                                        <h3 className="text-body-lg font-semibold">{step.title}</h3>
                                    </div>
                                    <p className="text-body text-text-secondary dark:text-text-dark-secondary leading-relaxed pl-11">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─ CTA ─ */}
                <section className="py-24 sm:py-32 border-t border-border dark:border-border-dark">
                    <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                            Ready to go digital?
                        </h2>
                        <p className="text-body-lg text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-10 max-w-xl mx-auto">
                            Join students and supervisors who have already moved from paper logbooks to a modern documentation workflow.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-white font-semibold text-body-lg hover:bg-primary-dark shadow-sm transition-all active:scale-[0.97]"
                            >
                                Create Free Account
                                <ArrowRight size={16} weight="bold" />
                            </Link>
                            <Link
                                href="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-border dark:border-border-dark font-semibold text-body-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="border-t border-border dark:border-border-dark">
                <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                            <BookOpenText size={14} weight="duotone" className="text-white" />
                        </div>
                        <span className="text-body font-bold">SIWES Logbook</span>
                    </div>
                    <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary">
                        &copy; {new Date().getFullYear()} SIWES Digital Logbook. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
