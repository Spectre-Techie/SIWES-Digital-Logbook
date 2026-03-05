'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BookOpenText, Eye, EyeSlash, CheckCircle } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { role: 'student' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
    } catch (err) {
      const msg = err.isOffline
        ? err.message
        : err.response?.data?.error?.message || err.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Submit daily log entries digitally',
    'Track attendance and working hours',
    'Get real-time supervisor feedback',
    'Export weekly progress reports',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 right-10 w-80 h-80 rounded-full bg-primary-500 blur-3xl" />
          <div className="absolute bottom-10 -left-10 w-72 h-72 rounded-full bg-primary-700 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <BookOpenText size={28} weight="duotone" className="text-primary-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">SIWES Logbook</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-normal leading-tight mb-6">
            Start Your<br />
            <span className="text-primary-300">Digital Journey.</span>
          </h2>
          <p className="text-lg text-neutral-300 max-w-md leading-relaxed mb-10">
            Join hundreds of students who have modernised their SIWES experience.
          </p>

          <ul className="space-y-4">
            {features.map((feat, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle size={20} weight="fill" className="text-primary-400 flex-shrink-0" />
                <span className="text-neutral-200">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Register form */}
      <div className="flex-1 flex items-center justify-center bg-surface dark:bg-surface-dark px-6 py-8 relative">
        <div className="absolute top-6 right-6">
            <ThemeToggle />
        </div>
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-3">
              <BookOpenText size={28} weight="duotone" className="text-white" />
            </div>
            <h1 className="text-heading text-text-primary dark:text-text-dark-primary">SIWES Digital Logbook</h1>
          </div>

          <div className="mb-6 hidden lg:block">
            <h1 className="text-display text-text-primary dark:text-text-dark-primary">
              Create Account
            </h1>
            <p className="text-body-lg text-text-secondary dark:text-text-dark-secondary mt-2">
              Get started with your digital logbook
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
              })}
            />

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

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[0-9])/,
                    message: 'Must contain an uppercase letter and a digit',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-secondary hover:text-text-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary transition-colors"
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Select
              label="I am a..."
              error={errors.role?.message}
              options={[
                { value: 'student', label: 'Student (Trainee)' },
                { value: 'supervisor', label: 'Supervisor (Industry/Academic)' },
              ]}
              {...register('role', { required: 'Please select a role' })}
            />

            {selectedRole === 'student' && (
              <div className="space-y-4 animate-slide-up pt-1 border-t border-border dark:border-border-dark">
                <p className="text-caption font-semibold text-primary-500 uppercase tracking-wider pt-3">Student Particulars</p>
                <Input
                  label="Matric Number"
                  placeholder="e.g. CSC/2023/001"
                  error={errors.matricNo?.message}
                  {...register('matricNo', {
                    maxLength: { value: 20, message: 'Max 20 characters' },
                  })}
                />
                <Input
                  label="Phone Number"
                  placeholder="e.g. 08012345678"
                  error={errors.phone?.message}
                  {...register('phone', {
                    maxLength: { value: 20, message: 'Max 20 characters' },
                  })}
                />
                <Input
                  label="Course of Study"
                  placeholder="e.g. Computer Science"
                  error={errors.courseOfStudy?.message}
                  {...register('courseOfStudy', {
                    maxLength: { value: 100, message: 'Max 100 characters' },
                  })}
                />
                <Input
                  label="Year of Study"
                  placeholder="e.g. 4"
                  error={errors.yearOfStudy?.message}
                  {...register('yearOfStudy', {
                    maxLength: { value: 10, message: 'Max 10 characters' },
                  })}
                />

                <p className="text-caption font-semibold text-primary-500 uppercase tracking-wider pt-3">Training Details</p>
                <Input
                  label="Company / Organisation"
                  placeholder="Where are you training?"
                  error={errors.companyName?.message}
                  {...register('companyName', {
                    required: selectedRole === 'student' ? 'Company name is required' : false,
                    maxLength: { value: 150, message: 'Max 150 characters' },
                  })}
                />
                <Input
                  label="Company Address"
                  placeholder="Full address of your training company"
                  error={errors.companyAddress?.message}
                  {...register('companyAddress', {
                    maxLength: { value: 250, message: 'Max 250 characters' },
                  })}
                />
                <Input
                  label="Department (Optional)"
                  placeholder="e.g. Software Engineering"
                  error={errors.department?.message}
                  {...register('department', {
                    maxLength: { value: 100, message: 'Max 100 characters' },
                  })}
                />
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-body text-text-secondary dark:text-text-dark-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
