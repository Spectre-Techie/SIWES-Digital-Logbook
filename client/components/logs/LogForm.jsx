'use client';
import { useForm } from 'react-hook-form';
import { format, differenceInDays } from 'date-fns';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import LateEntryWarning from './LateEntryWarning';

export default function LogForm({ onSubmit, defaultValues = {}, isSubmitting, isEdit = false }) {
    const today = format(new Date(), 'yyyy-MM-dd');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            date: defaultValues.date ? format(new Date(defaultValues.date), 'yyyy-MM-dd') : today,
            department: defaultValues.department || '',
            tasks: defaultValues.tasks || '',
            hours: defaultValues.hours || '',
            clockIn: defaultValues.clockIn || '',
            clockOut: defaultValues.clockOut || '',
            challenges: defaultValues.challenges || '',
            lessons: defaultValues.lessons || '',
        },
    });

    const dateValue = watch('date');
    const isLate = dateValue && differenceInDays(new Date(), new Date(dateValue)) > 3;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                    label="Date"
                    type="date"
                    max={today}
                    error={errors.date?.message}
                    {...register('date', {
                        required: 'Date is required',
                        validate: (v) =>
                            new Date(v) <= new Date() || 'Cannot log future dates',
                    })}
                />
                <Input
                    label="Hours Worked"
                    type="number"
                    min={1}
                    max={12}
                    placeholder="1 - 12"
                    error={errors.hours?.message}
                    {...register('hours', {
                        required: 'Hours worked is required',
                        min: { value: 1, message: 'Minimum 1 hour' },
                        max: { value: 12, message: 'Maximum 12 hours' },
                        valueAsNumber: true,
                    })}
                />
            </div>

            {/* Clock In / Clock Out */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                    label="Clock In"
                    type="time"
                    error={errors.clockIn?.message}
                    {...register('clockIn', {
                        pattern: {
                            value: /^([01]\d|2[0-3]):[0-5]\d$/,
                            message: 'Use HH:mm format',
                        },
                    })}
                />
                <Input
                    label="Clock Out"
                    type="time"
                    error={errors.clockOut?.message}
                    {...register('clockOut', {
                        pattern: {
                            value: /^([01]\d|2[0-3]):[0-5]\d$/,
                            message: 'Use HH:mm format',
                        },
                    })}
                />
            </div>

            {isLate && <LateEntryWarning date={dateValue} />}

            <Input
                label="Department / Unit (optional)"
                placeholder="e.g. Software Engineering"
                error={errors.department?.message}
                {...register('department', { maxLength: { value: 100, message: 'Maximum 100 characters' } })}
            />

            <Textarea
                label="Tasks Performed"
                placeholder="Describe the specific tasks you worked on today..."
                rows={5}
                maxLength={2000}
                error={errors.tasks?.message}
                {...register('tasks', {
                    required: 'Tasks description is required',
                    minLength: { value: 10, message: 'Please provide at least 10 characters' },
                    maxLength: { value: 2000, message: 'Maximum 2000 characters' },
                })}
            />

            <Textarea
                label="Challenges Faced (optional)"
                placeholder="Any difficulties or problems you encountered..."
                rows={3}
                maxLength={1000}
                error={errors.challenges?.message}
                {...register('challenges', {
                    maxLength: { value: 1000, message: 'Maximum 1000 characters' },
                })}
            />

            <Textarea
                label="Lessons Learned (optional)"
                placeholder="Key takeaways or skills developed today..."
                rows={3}
                maxLength={1000}
                error={errors.lessons?.message}
                {...register('lessons', {
                    maxLength: { value: 1000, message: 'Maximum 1000 characters' },
                })}
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto" loading={isSubmitting}>
                    {isEdit ? 'Update Log Entry' : 'Submit Log Entry'}
                </Button>
            </div>
        </form>
    );
}
