import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000,
});

// Request interceptor: attach JWT from localStorage
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('siwes_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle network errors, retry on cold-start, handle 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // No response at all  = network / offline error
        if (!error.response) {
            const offlineError = new Error(
                navigator?.onLine === false
                    ? 'You are offline. Please check your internet connection.'
                    : 'Unable to reach the server. Please check your connection and try again.'
            );
            offlineError.isOffline = true;
            return Promise.reject(offlineError);
        }

        // Friendly message from 503 (DB connection error)
        if (error.response.status === 503) {
            const friendly = new Error(
                error.response.data?.error?.message ||
                'Service temporarily unavailable. Please try again in a moment.'
            );
            friendly.response = error.response;
            return Promise.reject(friendly);
        }

        // Retry once on server 500 containing "Can't reach database" (Prisma Accelerate cold start)
        const msg = error.response?.data?.error?.message || '';
        if (
            !original._retried &&
            error.response?.status === 500 &&
            msg.includes("Can't reach database")
        ) {
            original._retried = true;
            await new Promise((r) => setTimeout(r, 2000));
            return api(original);
        }

        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('siwes_token');
            localStorage.removeItem('siwes_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
