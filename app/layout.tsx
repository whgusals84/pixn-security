import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "PIXN — Personal Blog",
  description: "보안, 개발, 공부와 일상의 기록을 담는 PIXN의 개인 블로그입니다.",
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
