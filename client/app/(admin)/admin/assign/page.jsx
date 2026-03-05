'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { Bone } from '@/components/ui/Skeletons';
import clsx from 'clsx';
import {
    UserCirclePlus,
    Users,
    GraduationCap,
    Buildings,
    CheckCircle,
    CaretDown,
    MagnifyingGlass,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function AdminAssignPage() {
    const [unassigned, setUnassigned] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const [supervisorId, setSupervisorId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [supSearch, setSupSearch] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [unRes, supRes] = await Promise.all([
                api.get('/admin/unassigned'),
                api.get('/admin/supervisors', { params: { limit: 100 } }),
            ]);
            setUnassigned(unRes.data.data);
            setSupervisors(supRes.data.data);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleStudent = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selected.length === unassigned.length) {
            setSelected([]);
        } else {
            setSelected(unassigned.map((s) => s.id));
        }
    };

    const handleAssign = async () => {
        if (!supervisorId) {
            toast.error('Please select a supervisor');
            return;
        }
        if (selected.length === 0) {
            toast.error('Please select at least one student');
            return;
        }

        setSubmitting(true);
        try {
            if (selected.length === 1) {
                await api.post('/admin/assign', {
                    studentId: selected[0],
                    supervisorId,
                });
            } else {
                await api.post('/admin/bulk-assign', {
                    studentIds: selected,
                    supervisorId,
                });
            }
            toast.success(`${selected.length} student${selected.length > 1 ? 's' : ''} assigned successfully`);
            setSelected([]);
            setSupervisorId('');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Assignment failed');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredSupervisors = supervisors.filter((s) =>
        s.name.toLowerCase().includes(supSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page-container">
                <div className="space-y-2 mb-6">
                    <Bone className="h-7 w-40" />
                    <Bone className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Bone key={i} className="h-20 rounded-2xl" />
                        ))}
                    </div>
                    <div className="space-y-3">
                        <Bone className="h-12 rounded-xl" />
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Bone key={i} className="h-14 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                    <UserCirclePlus size={22} weight="duotone" className="text-primary" />
                </div>
                <div>
                    <h1 className="text-heading text-text-primary dark:text-text-dark-primary">Assign Students</h1>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                        {unassigned.length} unassigned student{unassigned.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {unassigned.length === 0 ? (
                <div className="card p-12 text-center">
                    <CheckCircle size={48} weight="duotone" className="mx-auto text-success mb-4" />
                    <h3 className="text-subheading text-text-primary dark:text-text-dark-primary mb-2">All students assigned</h3>
                    <p className="text-body text-text-secondary dark:text-text-dark-secondary">
                        Every registered student has been assigned to a supervisor.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Unassigned students */}
                    <div className="lg:col-span-2">
                        {/* Select all + assign bar */}
                        <div className="flex items-center justify-between mb-3">
                            <button
                                onClick={toggleAll}
                                className="text-caption font-semibold text-primary hover:text-primary-dark transition-colors"
                            >
                                {selected.length === unassigned.length ? 'Deselect All' : 'Select All'}
                            </button>
                            {selected.length > 0 && (
                                <span className="text-caption font-medium text-text-secondary dark:text-text-dark-secondary">
                                    {selected.length} selected
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {unassigned.map((student) => {
                                const isSelected = selected.includes(student.id);
                                return (
                                    <button
                                        key={student.id}
                                        onClick={() => toggleStudent(student.id)}
                                        className={clsx(
                                            'w-full text-left card p-4 flex items-center gap-4 transition-all duration-200',
                                            isSelected
                                                ? 'ring-2 ring-primary bg-primary-50 dark:bg-primary-900/10 border-primary/30'
                                                : 'hover:shadow-card-hover'
                                        )}
                                    >
                                        {/* Checkbox */}
                                        <div className={clsx(
                                            'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                            isSelected
                                                ? 'bg-primary border-primary'
                                                : 'border-border dark:border-border-dark'
                                        )}>
                                            {isSelected && <CheckCircle size={14} weight="fill" className="text-white" />}
                                        </div>

                                        {/* Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
                                            <span className="text-caption font-bold text-white">
                                                {student.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-body font-semibold text-text-primary dark:text-text-dark-primary truncate">
                                                {student.name}
                                            </p>
                                            <div className="flex items-center gap-3 text-caption text-text-secondary dark:text-text-dark-secondary">
                                                {student.matricNo && (
                                                    <span className="flex items-center gap-1"><GraduationCap size={11} /> {student.matricNo}</span>
                                                )}
                                                {student.companyName && (
                                                    <span className="flex items-center gap-1 truncate"><Buildings size={11} /> {student.companyName}</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Supervisor selection + assign button */}
                    <div>
                        <div className="card p-5 sticky top-20">
                            <h3 className="text-body font-semibold text-text-primary dark:text-text-dark-primary mb-3">
                                Select Supervisor
                            </h3>

                            {/* Search supervisors */}
                            <div className="relative mb-3">
                                <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                <input
                                    value={supSearch}
                                    onChange={(e) => setSupSearch(e.target.value)}
                                    placeholder="Filter supervisors..."
                                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border dark:border-border-dark bg-surface-muted dark:bg-surface-dark-muted text-caption placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            {/* Supervisor list */}
                            <div className="space-y-1.5 max-h-80 overflow-y-auto">
                                {filteredSupervisors.map((sup) => (
                                    <button
                                        key={sup.id}
                                        onClick={() => setSupervisorId(sup.id)}
                                        className={clsx(
                                            'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between',
                                            supervisorId === sup.id
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-surface-muted dark:hover:bg-surface-dark-muted text-text-primary dark:text-text-dark-primary'
                                        )}
                                    >
                                        <div>
                                            <p className="text-body font-medium truncate">{sup.name}</p>
                                            <p className={clsx(
                                                'text-caption',
                                                supervisorId === sup.id ? 'text-white/70' : 'text-text-tertiary dark:text-text-dark-tertiary'
                                            )}>
                                                {sup.studentCount} student{sup.studentCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        {supervisorId === sup.id && (
                                            <CheckCircle size={18} weight="fill" />
                                        )}
                                    </button>
                                ))}
                                {filteredSupervisors.length === 0 && (
                                    <p className="text-caption text-text-tertiary text-center py-4">No supervisors found</p>
                                )}
                            </div>

                            {/* Assign button */}
                            <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    loading={submitting}
                                    disabled={selected.length === 0 || !supervisorId}
                                    onClick={handleAssign}
                                >
                                    <UserCirclePlus size={18} weight="bold" />
                                    Assign {selected.length > 0 ? `${selected.length} Student${selected.length > 1 ? 's' : ''}` : ''}
                                </Button>
                                {selected.length > 0 && supervisorId && (
                                    <p className="text-caption text-text-tertiary dark:text-text-dark-tertiary text-center mt-2">
                                        to {supervisors.find((s) => s.id === supervisorId)?.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
