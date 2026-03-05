import './globals.css';
import { Outfit } from 'next/font/google';
import Providers from '@/components/Providers';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
    weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata = {
    title: 'SIWES Digital Logbook',
    description: 'Digital logbook and attendance tracker for SIWES students and supervisors',
    keywords: ['SIWES', 'logbook', 'attendance', 'student', 'supervisor', 'training'],
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'SIWES Logbook',
    },
    icons: {
        icon: '/favicon.svg',
        apple: '/icons/icon.svg',
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#7C3AED' },
        { media: '(prefers-color-scheme: dark)', color: '#18181B' },
    ],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.variable} ${outfit.className}`}>
                <Providers>
                    {children}
                </Providers>
                <ServiceWorkerRegistration />
            </body>
        </html>
    );
}
