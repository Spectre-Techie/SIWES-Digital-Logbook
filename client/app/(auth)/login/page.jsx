'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { BookOpenText, Eye, EyeSlash } from '@phosphor-icons/react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function LoginPage() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await login(data.email, data.password);
            toast.success('Welcome back!');
        } catch (err) {
            const msg = err.isOffline
                ? err.message
                : err.response?.data?.error?.message || err.message || 'Login failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left: Branding panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-800 via-primary-900 to-neutral-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 -left-10 w-72 h-72 rounded-full bg-primary-400 blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-600 blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
                    <div className="inline-flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                            <BookOpenText size={28} weight="duotone" className="text-primary-200" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SIWES Logbook</span>
                    </div>
                    <h2 className="text-4xl xl:text-5xl font-normal leading-tight mb-6">
                        Your Training,<br />
                        <span className="text-primary-300">Digitally Tracked.</span>
                    </h2>
                    <p className="text-lg text-primary-200/80 max-w-md leading-relaxed">
                        Submit daily logs, mark attendance, get supervisor feedback  --  all from one platform built for SIWES students.
                    </p>
                    <div className="mt-12 flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">500+</p>
                            <p className="text-caption text-primary-300">Active Students</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">98%</p>
                            <p className="text-caption text-primary-300">Approval Rate</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">24h</p>
                            <p className="text-caption text-primary-300">Avg. Review Time</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Login form */}
            <div className="flex-1 flex items-center justify-center bg-surface dark:bg-surface-dark px-6 py-12 relative">
                <div className="absolute top-6 right-6">
                    <ThemeToggle />
                </div>
                <div className="w-full max-w-md animate-fade-in">
                    {/* Mobile-only logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-3">
                            <BookOpenText size={28} weight="duotone" className="text-white" />
                        </div>
                        <h1 className="text-heading text-text-primary dark:text-text-dark-primary">SIWES Digital Logbook</h1>
                    </div>

                    <div className="mb-8 hidden lg:block">
                        <h1 className="text-display text-text-primary dark:text-text-dark-primary">
                            Welcome back
                        </h1>
                        <p className="text-body-lg text-text-secondary dark:text-text-dark-secondary mt-2">
                            Sign in to continue to your logbook
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@university.edu"
                            error={errors.email?.message}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />

                        <div>
                            <label htmlFor="password" className="block text-body font-medium text-text-primary dark:text-text-dark-primary mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className={clsx(
                                        'w-full rounded-xl border bg-surface-elevated px-4 py-2.5 text-body text-text-primary placeholder:text-text-tertiary transition-all duration-200 pr-10',
                                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                                        'dark:bg-surface-dark-elevated dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary',
                                        errors.password ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border dark:border-border-dark',
                                    )}
                                    {...register('password', {
                                        required: 'Password is required',
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary transition-colors"
                                >
                                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-caption text-danger font-medium mt-1.5">{errors.password.message}</p>
                            )}
                        </div>

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                            New here?{' '}
                            <Link href="/register" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
}
