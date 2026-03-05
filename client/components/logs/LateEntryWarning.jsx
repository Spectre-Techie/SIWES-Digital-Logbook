import { WarningCircle } from '@phosphor-icons/react';
import { differenceInDays, format } from 'date-fns';

export default function LateEntryWarning({ date }) {
    const days = differenceInDays(new Date(), new Date(date));

    return (
        <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-light dark:bg-warning/10 dark:border-warning/30 p-3">
            <WarningCircle size={20} weight="fill" className="text-warning flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-body font-semibold text-warning-dark dark:text-warning">
                    Late Entry Warning
                </p>
                <p className="text-caption text-warning-dark/80 dark:text-warning/80 mt-0.5">
                    This entry is {days} day{days !== 1 ? 's' : ''} past the recommended submission window.
                    It may receive additional scrutiny during review.
                </p>
            </div>
        </div>
    );
}
