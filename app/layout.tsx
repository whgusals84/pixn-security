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
  title: 'PIXN — Digital Analytics & Growth',
  description: '데이터를 더 나은 질문과 실행으로 연결하는 디지털 분석가 포트폴리오',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'PIXN — Digital Analytics & Growth',
    description: '데이터를 더 나은 질문과 실행으로 연결하는 디지털 분석가 포트폴리오',
    images: [{ url: '/og.png', width: 1672, height: 941, alt: 'PIXN digital analytics portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIXN — Digital Analytics & Growth',
    description: '데이터를 더 나은 질문과 실행으로 연결하는 디지털 분석가 포트폴리오',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
