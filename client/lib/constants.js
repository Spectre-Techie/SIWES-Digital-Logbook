// Status badge classes map to .badge-* classes defined in globals.css
export const STATUS_STYLES = {
    pending:  { badgeClass: 'badge-pending',  label: 'Pending',  icon: 'Clock'        },
    approved: { badgeClass: 'badge-approved', label: 'Approved', icon: 'CheckCircle'  },
    rejected: { badgeClass: 'badge-rejected', label: 'Rejected', icon: 'XCircle'      },
};

export const ATTENDANCE_STATUS_STYLES = {
    present: { badgeClass: 'badge-present', label: 'Present', icon: 'Check'       },
    absent:  { badgeClass: 'badge-absent',  label: 'Absent',  icon: 'XCircle'     },
    excused: { badgeClass: 'badge-excused', label: 'Excused', icon: 'Clock'       },
};

export const ATTENDANCE_OPTIONS = [
    { value: 'present', label: 'Present' },
    { value: 'absent',  label: 'Absent'  },
    { value: 'excused', label: 'Excused' },
];

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SIWES Digital Logbook';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
