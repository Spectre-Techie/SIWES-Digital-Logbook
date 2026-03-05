'use client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import NextTopLoader from 'nextjs-toploader';
import ApiLoadingBar from '@/components/ui/ApiLoadingBar';

// Toast base style — neutral, uses design tokens via CSS vars not available here;
// so we hardcode the light-mode values (toasts always render light for legibility)
const toastBase = {
    fontFamily: 'Outfit, system-ui, sans-serif',
    fontSize: '13px',
    fontWeight: '500',
    lineHeight: '1.4',
    borderRadius: '14px',
    padding: '12px 16px',
    background: '#FFFFFF',
    color: '#18181B',
    border: '1px solid #E4E4E7',
    boxShadow: '0 4px 16px 0 rgb(0 0 0 / 0.08)',
};

export default function Providers({ children }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <NextTopLoader color="#7C3AED" height={3} showSpinner={false} shadow="0 0 10px #7C3AED,0 0 5px #7C3AED" />
                <ApiLoadingBar />
                {children}
                <Toaster
                    position="top-right"
                    gutter={8}
                    toastOptions={{
                        duration: 3500,
                        style: toastBase,
                        success: {
                            style: { ...toastBase, background: '#F5F3FF', color: '#4C1D95', border: '1px solid #DDD6FE' },
                            iconTheme: { primary: '#7C3AED', secondary: '#F5F3FF' },
                        },
                        error: {
                            style: { ...toastBase, background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FECACA' },
                            iconTheme: { primary: '#DC2626', secondary: '#FEE2E2' },
                        },
                    }}
                />
            </AuthProvider>
        </ThemeProvider>
    );
}
