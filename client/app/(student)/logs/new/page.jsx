'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LogForm from '@/components/logs/LogForm';
import { useLogs } from '@/hooks/useLogs';
import { NotePencil } from '@phosphor-icons/react';

export default function NewLogPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createLog } = useLogs();
    const router = useRouter();

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await createLog(data);
            router.push('/logs');
        } catch {
            // Error handled in hook
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container max-w-3xl">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                        <NotePencil size={22} weight="duotone" className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-heading text-text-primary dark:text-text-dark-primary">
                            New Log Entry
                        </h1>
                        <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                            Record your training activities for the day
                        </p>
                    </div>
                </div>
            </div>

            <div className="card p-6">
                <LogForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
