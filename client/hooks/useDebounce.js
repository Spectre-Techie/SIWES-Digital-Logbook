import { useState, useEffect, useRef } from 'react';

/**
 * Debounces a value by the specified delay.
 * Returns the debounced value — updates only after `delay` ms of inactivity.
 */
export function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
