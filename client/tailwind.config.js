/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                // ── Brand Accent: Deep Violet (single brand color, no blue) ──
                primary: {
                    DEFAULT: '#7C3AED',
                    dark:    '#6D28D9',
                    light:   '#EDE9FE',
                    50:  '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                },

                // ── Neutral Scale (zinc) ──────────────────────────────────────
                neutral: {
                    50:  '#FAFAFA',
                    100: '#F4F4F5',
                    200: '#E4E4E7',
                    300: '#D4D4D8',
                    400: '#A1A1AA',
                    500: '#71717A',
                    600: '#52525B',
                    700: '#3F3F46',
                    800: '#27272A',
                    900: '#18181B',
                    950: '#09090B',
                },

                // ── Semantic Status ───────────────────────────────────────────
                success: {
                    DEFAULT: '#16A34A',
                    light:   '#DCFCE7',
                    dark:    '#15803D',
                },
                danger: {
                    DEFAULT: '#DC2626',
                    light:   '#FEE2E2',
                    dark:    '#B91C1C',
                },
                warning: {
                    DEFAULT: '#D97706',
                    light:   '#FEF3C7',
                    dark:    '#B45309',
                },

                // ── Surface tokens (light mode) ───────────────────────────────
                surface: {
                    DEFAULT:  '#FAFAFA',     // page background
                    elevated: '#FFFFFF',     // card / modal background
                    muted:    '#F4F4F5',     // input / subtle background
                    // dark mode variants
                    dark:          '#111111',
                    'dark-elevated': '#1C1C1E',
                    'dark-muted':    '#0A0A0A',
                },

                // ── Text tokens ───────────────────────────────────────────────
                text: {
                    primary:   '#18181B',
                    secondary: '#71717A',
                    tertiary:  '#A1A1AA',
                    // dark mode
                    'dark-primary':   '#FAFAFA',
                    'dark-secondary': '#A1A1AA',
                    'dark-tertiary':  '#71717A',
                },

                // ── Border tokens ─────────────────────────────────────────────
                border: {
                    DEFAULT: '#E4E4E7',
                    strong:  '#D4D4D8',
                    dark:    '#27272A',
                    'dark-strong': '#3F3F46',
                },
            },

            // ── Typography ────────────────────────────────────────────────────
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                // Custom scale — sets size + line-height only; weight via font-bold etc.
                'display':    ['2rem',    { lineHeight: '2.5rem' }],
                'heading':    ['1.5rem',  { lineHeight: '2rem' }],
                'subheading': ['1.125rem',{ lineHeight: '1.75rem' }],
                'body-lg':    ['1rem',    { lineHeight: '1.625rem' }],
                'body':       ['0.875rem',{ lineHeight: '1.375rem' }],
                'caption':    ['0.75rem', { lineHeight: '1.125rem' }],
            },

            // ── Shadows ───────────────────────────────────────────────────────
            boxShadow: {
                'card':       '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
                'card-hover': '0 4px 16px 0 rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.05)',
                'elevated':   '0 12px 32px -4px rgb(0 0 0 / 0.10), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
                'input':      '0 1px 2px 0 rgb(0 0 0 / 0.04)',
            },

            // ── Animations ────────────────────────────────────────────────────
            animation: {
                'fade-in':   'fadeIn 0.25s ease-out',
                'slide-up':  'slideUp 0.25s ease-out',
                'scale-in':  'scaleIn 0.2s ease-out',
                'spin-slow': 'spin 1.5s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%':   { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%':   { opacity: '0', transform: 'scale(0.96)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },

            // ── Spacing extras ────────────────────────────────────────────────
            maxWidth: {
                'content': '1280px',
            },
        },
    },
    plugins: [],
};
