import clsx from 'clsx';
import { STATUS_STYLES } from '@/lib/constants';
import { Clock, CheckCircle, XCircle } from '@phosphor-icons/react';

const iconMap = { Clock, CheckCircle, XCircle };

export default function StatusBadge({ status, size = 'sm' }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
    const Icon = iconMap[style.icon];

    return (
        <span className={clsx(
            style.badgeClass,
            size === 'md' && 'px-3 py-1 text-body'
        )}>
            {Icon && <Icon size={size === 'sm' ? 11 : 13} weight="fill" />}
            {style.label}
        </span>
    );
}
