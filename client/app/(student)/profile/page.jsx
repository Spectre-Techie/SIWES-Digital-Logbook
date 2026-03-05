'use client';
import { useAuth } from '@/context/AuthContext';
import { Bone } from '@/components/ui/Skeletons';
import {
    UserCircle,
    EnvelopeSimple,
    GraduationCap,
    Buildings,
    MapPin,
    Phone,
    BookOpen,
    CalendarBlank,
    IdentificationCard,
} from '@phosphor-icons/react';

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="page-container max-w-2xl">
                <Bone className="h-7 w-40 mb-6" />
                <div className="card p-6 space-y-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Bone className="w-5 h-5 rounded" />
                            <Bone className="h-4 w-32" />
                            <Bone className="h-4 w-48 ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!user) return null;

    const student = user.student || {};

    const fields = [
        { icon: UserCircle, label: 'Full Name', value: user.name },
        { icon: EnvelopeSimple, label: 'Email', value: user.email },
        { icon: IdentificationCard, label: 'Matric Number', value: user.matricNo },
        { icon: Phone, label: 'Phone', value: user.phone },
        { icon: BookOpen, label: 'Course of Study', value: student.courseOfStudy },
        { icon: CalendarBlank, label: 'Year of Study', value: student.yearOfStudy },
        { icon: Buildings, label: 'Company', value: student.companyName },
        { icon: MapPin, label: 'Company Address', value: student.companyAddress },
        { icon: Buildings, label: 'Department', value: student.department },
        { icon: MapPin, label: 'Permanent Address', value: student.permanentAddress },
        { icon: Phone, label: 'Parent Phone', value: student.parentPhone },
        { icon: UserCircle, label: 'Industry Supervisor', value: student.industrySupervisorName },
        { icon: Phone, label: 'Industry Sup. Phone', value: student.industrySupervisorPhone },
    ].filter((f) => f.value);

    return (
        <div className="page-container max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <UserCircle size={22} weight="duotone" className="text-primary" />
                </div>
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary">Student Profile</h1>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">Your particulars</p>
                </div>
            </div>

            {/* Avatar card */}
            <div className="card p-6 mb-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-heading font-bold text-white">
                        {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                </div>
                <div>
                    <p className="text-subheading font-bold text-text-primary dark:text-text-dark-primary">{user.name}</p>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary capitalize">{user.role}</p>
                    {user.matricNo && <p className="text-caption text-primary font-medium mt-0.5">{user.matricNo}</p>}
                </div>
            </div>

            {/* Details */}
            <div className="card overflow-hidden">
                <div className="px-5 py-3 bg-surface-muted dark:bg-surface-dark-muted border-b border-border dark:border-border-dark">
                    <p className="text-caption font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider">
                        Student Particulars
                    </p>
                </div>
                <div className="divide-y divide-border/50 dark:divide-border-dark/50">
                    {fields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-5 py-3.5">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Icon size={16} weight="duotone" className="text-text-tertiary dark:text-text-dark-tertiary flex-shrink-0" />
                                    <span className="text-body text-text-secondary dark:text-text-dark-secondary sm:w-40 sm:flex-shrink-0">
                                        {field.label}
                                    </span>
                                </div>
                                <span className="text-body font-medium text-text-primary dark:text-text-dark-primary pl-6 sm:pl-0 break-words">
                                    {field.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Supervisor info */}
            {student.supervisor && (
                <div className="card p-5 mt-6">
                    <p className="text-caption font-semibold text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider mb-3">
                        Assigned Supervisor
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center">
                            <span className="text-caption font-bold text-white">
                                {student.supervisor.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                        </div>
                        <div>
                            <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary">{student.supervisor.name}</p>
                            <p className="text-caption text-text-secondary dark:text-text-dark-secondary">{student.supervisor.email}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
