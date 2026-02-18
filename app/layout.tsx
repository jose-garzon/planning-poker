import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'Next.js 15 Interview Scaffold',
  description:
    'Production-ready Next.js 15 scaffold demonstrating best practices for interview code challenges',
};

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ['400', '600', '700', '800'],
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={bricolageGrotesque.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
