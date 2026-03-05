import { format, formatDistanceToNowStrict, isToday, isYesterday, parseISO } from 'date-fns';

// ─── Date formatting ──────────────────────────────────────────────

/** "Mon, Jan 5 2026" */
export function formatDate(date) {
    return format(new Date(date), 'EEE, MMM d yyyy');
}

/** "January 5, 2026" */
export function formatDateLong(date) {
    return format(new Date(date), 'MMMM d, yyyy');
}

/** "Jan 5" — compact form for cards / lists */
export function formatDateShort(date) {
    return format(new Date(date), 'MMM d');
}

/** "Jan 5, 2026  2:30 PM" */
export function formatDateTime(date) {
    return format(new Date(date), 'MMM d, yyyy  h:mm a');
}

/** "Today", "Yesterday", or "Mon, Jan 5" */
export function formatRelativeDay(date) {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'EEE, MMM d');
}

/** "3 hours ago", "2 days ago" */
export function timeAgo(date) {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
}

// ─── Number formatting ────────────────────────────────────────────

/**
 * Compact number display: 1200 → "1.2k"
 * Falls back to plain number for values < 1000.
 */
export function formatCompact(num) {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
    return String(num);
}

/** "6.5 hrs" — hours display with unit */
export function formatHours(hours) {
    if (hours == null) return '0 hrs';
    return `${Number(hours)} hr${Number(hours) !== 1 ? 's' : ''}`;
}

/** "85%" — percentage with symbol */
export function formatPercent(value, decimals = 0) {
    if (value == null) return '0%';
    return `${Number(value).toFixed(decimals)}%`;
}

// ─── String helpers ───────────────────────────────────────────────

/** Extract initials: "Adebayo Oyekan" → "AO" */
export function initials(name, max = 2) {
    if (!name) return '';
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, max);
}

/** Truncate with ellipsis: "Long text here..." */
export function truncate(str, length = 60) {
    if (!str || str.length <= length) return str || '';
    return str.slice(0, length).trimEnd() + '...';
}

/** Capitalize first letter */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ─── ISO helpers ──────────────────────────────────────────────────

/** Safely parse an ISO string, returning a Date or null */
export function safeParse(isoString) {
    try {
        return parseISO(isoString);
    } catch {
        return null;
    }
}

/** Format a date to YYYY-MM-DD for API payloads */
export function toISODate(date) {
    return format(new Date(date), 'yyyy-MM-dd');
}
