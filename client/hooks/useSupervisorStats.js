import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useSupervisorStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/stats/supervisor');
            setStats(data.data);
        } catch (err) {
            setError(err.response?.data?.error?.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return { stats, loading, error, refetch: fetchStats };
}
