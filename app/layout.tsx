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
  title: 'PIXN — Security Knowledge Archive',
  description: '웹 보안 학습 자료와 안전한 개발 지침, 오픈소스 도구를 정리한 지식 아카이브',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'PIXN — Security Knowledge Archive',
    description: '웹 보안 학습 자료와 안전한 개발 지침, 오픈소스 도구를 정리한 지식 아카이브',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'PIXN Security Knowledge Archive' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PIXN — Security Knowledge Archive',
    description: '웹 보안 학습 자료와 안전한 개발 지침, 오픈소스 도구를 정리한 지식 아카이브',
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
