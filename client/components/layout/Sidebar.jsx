'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';
import {
    House,
    Notebook,
    CalendarCheck,
    NotePencil,
    SignOut,
    List,
    X,
    BookOpenText,
    Users,
    Sun,
    Moon,
    Desktop,
    ChartBar,
    UserCirclePlus,
    UserCircle,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';

// ── Navigation config ──────────────────────────────────────────────────────
const studentLinks = [
    { href: '/dashboard',   label: 'Dashboard',  icon: House         },
    { href: '/logs',        label: 'Log Entries', icon: Notebook      },
    { href: '/logs/new',    label: 'New Entry',   icon: NotePencil    },
    { href: '/attendance',  label: 'Attendance',  icon: CalendarCheck },
    { href: '/profile',     label: 'Profile',     icon: UserCircle    },
];

const supervisorLinks = [
    { href: '/supervisor',          label: 'Dashboard', icon: House  },
    { href: '/supervisor/students', label: 'Students',  icon: Users  },
];

const adminLinks = [
    { href: '/admin',              label: 'Dashboard',    icon: ChartBar        },
    { href: '/admin/students',     label: 'Students',     icon: Users           },
    { href: '/admin/supervisors',  label: 'Supervisors',  icon: Users           },
    { href: '/admin/assign',       label: 'Assign',       icon: UserCirclePlus  },
];

// ── Theme toggle pill ──────────────────────────────────────────────────────
const themeOptions = [
    { value: 'system', icon: Desktop, label: 'System' },
    { value: 'light',  icon: Sun,     label: 'Light'  },
    { value: 'dark',   icon: Moon,    label: 'Dark'   },
];

function ThemePill() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-0.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800">
            {themeOptions.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    className={clsx(
                        'flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-caption font-semibold transition-all duration-200',
                        theme === value
                            ? 'bg-surface-elevated text-primary shadow-sm dark:bg-surface-dark-elevated dark:text-primary-400'
                            : 'text-text-tertiary hover:text-text-secondary dark:text-text-dark-tertiary dark:hover:text-text-dark-secondary'
                    )}
                >
                    <Icon size={14} weight={theme === value ? 'fill' : 'regular'} />
                    <span className="hidden xl:inline text-[11px]">{label}</span>
                </button>
            ))}
        </div>
    );
}

// ── Sidebar content ────────────────────────────────────────────────────────
function NavContent({ onClose }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const links = user?.role === 'faculty_admin'
        ? adminLinks
        : user?.role === 'supervisor'
            ? supervisorLinks
            : studentLinks;

    const homeHref = user?.role === 'faculty_admin'
        ? '/admin'
        : user?.role === 'supervisor'
            ? '/supervisor'
            : '/dashboard';

    const isActive = (href) => {
        // Exact match for home routes
        if (href === '/dashboard' || href === '/supervisor' || href === '/admin') return pathname === href;
        // For sub-routes, ensure exact or starts-with-slash (prevents /logs matching /logs/new AND /logs)
        return pathname === href || pathname.startsWith(href + '/');
    };

    const roleLabel = user?.role === 'faculty_admin' ? 'Faculty Admin' : user?.role;

    return (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="px-4 py-4 border-b border-border dark:border-border-dark">
                <Link
                    href={homeHref}
                    onClick={onClose}
                    className="flex items-center gap-3"
                >
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                        <BookOpenText size={19} weight="duotone" className="text-white" />
                    </div>
                    <div>
                        <p className="text-body font-bold text-text-primary dark:text-text-dark-primary leading-tight">
                            SIWES Logbook
                        </p>
                        <p className="text-caption capitalize text-text-tertiary dark:text-text-dark-tertiary">
                            {roleLabel}
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={clsx(
                                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-body font-medium transition-all duration-200',
                                active
                                    ? 'bg-primary text-white'
                                    : 'text-text-secondary hover:bg-neutral-100 hover:text-text-primary dark:text-text-dark-secondary dark:hover:bg-neutral-800/60 dark:hover:text-text-dark-primary'
                            )}
                        >
                            <Icon
                                size={18}
                                weight={active ? 'fill' : 'duotone'}
                                className={active ? 'text-white' : 'text-text-tertiary group-hover:text-text-primary dark:text-text-dark-tertiary dark:group-hover:text-text-dark-primary transition-colors'}
                            />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: theme + user + sign out */}
            <div className="px-3 py-3 border-t border-border dark:border-border-dark space-y-3">
                {/* Theme toggle */}
                <ThemePill />

                {/* User info block */}
                <div className="px-2 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                    <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary truncate leading-tight">
                        {user?.name}
                    </p>
                    <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary truncate">
                        {user?.email}
                    </p>
                </div>

                {/* Sign out */}
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body font-medium text-danger hover:bg-danger-light dark:hover:bg-danger/10 transition-all duration-200"
                >
                    <SignOut size={18} weight="duotone" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();

    const close = () => setMobileOpen(false);

    return (
        <>
            {/* Desktop sidebar — fixed left column */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-surface-elevated dark:bg-surface-dark-elevated border-r border-border dark:border-border-dark z-30">
                <NavContent onClose={close} />
            </aside>

            {/* Mobile top bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-surface-elevated/95 dark:bg-surface-dark-elevated/95 backdrop-blur-md border-b border-border dark:border-border-dark">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <BookOpenText size={16} weight="duotone" className="text-white" />
                    </div>
                    <span className="text-body font-bold text-text-primary dark:text-text-dark-primary">
                        SIWES Logbook
                    </span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="w-11 h-11 flex items-center justify-center rounded-xl text-text-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={20} /> : <List size={20} />}
                </button>
            </header>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                        onClick={close}
                    />
                    <aside className="fixed top-0 left-0 bottom-0 w-72 bg-surface-elevated dark:bg-surface-dark-elevated z-50 lg:hidden animate-slide-up shadow-elevated overflow-y-auto">
                        <NavContent onClose={close} />
                    </aside>
                </>
            )}
        </>
    );
}
