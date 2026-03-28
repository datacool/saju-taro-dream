import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI사주 - 사주팔자 운세 분석',
  description: 'AI 기반 만세력 사주팔자 분석. 절기 기반 정확한 사주 계산으로 타고난 기질, 취업/이직, 연애운, 재물운, 궁합까지 확인하세요.',
  keywords: ['사주', '사주팔자', '운세', '만세력', 'AI사주', '오늘의운세'],
  openGraph: {
    title: 'AI사주 - 사주팔자 운세 분석',
    description: 'AI가 당신의 사주를 해킹합니다',
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
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#0a0a0f]">
        <div className="scanline" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
