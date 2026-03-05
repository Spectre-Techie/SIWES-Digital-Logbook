import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export function useAttendance({ month, year } = {}) {
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(month ?? currentDate.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(year ?? currentDate.getFullYear());
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/attendance', {
                params: { month: currentMonth, year: currentYear },
            });
            setRecords(data.data.records);
            setSummary(data.data.summary);
        } catch {
            toast.error('Failed to load attendance');
        } finally {
            setLoading(false);
        }
    }, [currentMonth, currentYear]);

    useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

    const markAttendance = async (date, status) => {
        const dateStr = format(new Date(date), 'yyyy-MM-dd');
        setMarking(dateStr);
        try {
            await api.post('/attendance', { date: dateStr, status });
            toast.success(`Marked as ${status}`);
            fetchAttendance();
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to mark attendance');
        } finally {
            setMarking(null);
        }
    };

    const prevMonth = () => {
        if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear((y) => y - 1); }
        else setCurrentMonth((m) => m - 1);
    };

    const nextMonth = () => {
        if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear((y) => y + 1); }
        else setCurrentMonth((m) => m + 1);
    };

    return {
        records,
        summary,
        loading,
        marking,
        month: currentMonth,
        year: currentYear,
        fetchAttendance,
        markAttendance,
        prevMonth,
        nextMonth,
    };
}
