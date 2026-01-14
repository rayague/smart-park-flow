import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

import '../index.css';
import AppProviders from '@/providers/AppProviders';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'SmartPark - Intelligent Parking Solutions',
  description:
    'Find, book, and pay for parking in seconds. Real-time availability, EV charging, and seamless payments - all in one platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} min-h-dvh bg-background dark:bg-transparent text-foreground overflow-x-hidden`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
