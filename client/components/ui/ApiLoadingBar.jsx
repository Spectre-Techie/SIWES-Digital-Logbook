'use client';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';

/**
 * A thin progress bar that appears at the top of the viewport whenever
 * an API request is in flight. Provides visual feedback for slow requests.
 */
export default function ApiLoadingBar() {
    const [loading, setLoading] = useState(false);
    const countRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        const reqId = api.interceptors.request.use((config) => {
            countRef.current += 1;
            // Small delay before showing bar — avoids flicker on fast requests
            if (countRef.current === 1) {
                timerRef.current = setTimeout(() => setLoading(true), 180);
            }
            return config;
        });

        const resId = api.interceptors.response.use(
            (response) => {
                countRef.current = Math.max(0, countRef.current - 1);
                if (countRef.current === 0) {
                    clearTimeout(timerRef.current);
                    setLoading(false);
                }
                return response;
            },
            (error) => {
                countRef.current = Math.max(0, countRef.current - 1);
                if (countRef.current === 0) {
                    clearTimeout(timerRef.current);
                    setLoading(false);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(reqId);
            api.interceptors.response.eject(resId);
            clearTimeout(timerRef.current);
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-primary/10 overflow-hidden">
            <div className="h-full bg-primary rounded-r-full animate-api-bar" />
        </div>
    );
}
