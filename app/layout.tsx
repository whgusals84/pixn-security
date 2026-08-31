import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixn-analytics-portfolio.forhm0220.chatgpt.site"),
  title: "PIXN — Personal Blog",
  description: "보안, 개발, 공부와 일상의 기록을 담는 PIXN의 개인 블로그입니다.",
  openGraph: {
    title: "PIXN — Personal Blog",
    description: "Security, code, study, and life — notes from what PIXN actually learns.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PIXN — Personal Blog",
    description: "Security, code, study, and life — notes from what PIXN actually learns.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/assets/style.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
