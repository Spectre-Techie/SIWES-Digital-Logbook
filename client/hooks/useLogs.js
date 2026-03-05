import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function useLogs({ page = 1, status, startDate, endDate } = {}) {
    const [logs, setLogs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { page, ...(status && { status }), ...(startDate && { startDate, endDate }) };
            const { data } = await api.get('/logs', { params });
            setLogs(data.data);
            setMeta(data.meta);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load logs');
        } finally {
            setLoading(false);
        }
    }, [page, status, startDate, endDate]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const createLog = async (payload) => {
        try {
            const { data } = await api.post('/logs', payload);
            toast.success('Log entry submitted successfully');
            fetchLogs();
            return data.data;
        } catch (err) {
            const msg = err.response?.data?.error?.message || 'Failed to create log';
            toast.error(msg);
            throw err;
        }
    };

    const updateLog = async (id, payload) => {
        try {
            const { data } = await api.put(`/logs/${id}`, payload);
            toast.success('Log entry updated');
            fetchLogs();
            return data.data;
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to update log');
            throw err;
        }
    };

    const deleteLog = async (id) => {
        try {
            await api.delete(`/logs/${id}`);
            toast.success('Log entry deleted');
            setLogs((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            toast.error(err.response?.data?.error?.message || 'Failed to delete log');
            throw err;
        }
    };

    return { logs, meta, loading, error, refetch: fetchLogs, createLog, updateLog, deleteLog };
}
