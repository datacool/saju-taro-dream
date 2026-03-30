import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '운세 에이전트 — AI 사주·타로·꿈해몽',
  description: 'AI 기반 사주팔자, 타로 카드, 꿈해몽 통합 운세 서비스. 당신의 운명을 AI가 분석합니다.',
  keywords: ['사주', '타로', '꿈해몽', '운세', 'AI운세', '사주팔자', '타로카드'],
  openGraph: {
    title: '운세 에이전트 — AI 사주·타로·꿈해몽',
    description: 'AI가 당신의 운명을 읽습니다',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#0B1326]">
        <div className="scanline" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
