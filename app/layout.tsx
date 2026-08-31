import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pixn-analytics-portfolio.forhm0220.chatgpt.site'),
  title: 'PIXN — Web Security & Applied Cryptography',
  description: 'Field notes from PIXN, a student exploring web security, applied cryptography, secure systems, and open-source tooling.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'PIXN — Web Security & Applied Cryptography',
    description: 'Field notes from PIXN, a student exploring web security, applied cryptography, secure systems, and open-source tooling.',
    images: [{ url: '/og-pixn-field-notes.png', width: 1200, height: 630, alt: 'PIXN Web Security and Applied Cryptography' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIXN — Web Security & Applied Cryptography',
    description: 'Field notes from PIXN, a student exploring web security, applied cryptography, secure systems, and open-source tooling.',
    images: ['/og-pixn-field-notes.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
