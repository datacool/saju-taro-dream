import type { Metadata } from 'next';
import './globals.css';

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://saju-taro-dream.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: '운세 에이전트 — AI 사주·타로·꿈해몽',
    template: '%s | 운세 에이전트',
  },
  description: 'AI가 당신의 사주팔자, 타로 카드, 꿈을 해석합니다. 만세력 기반 정확한 사주 분석, 78장 타로 리딩, 꿈해몽을 하나의 서비스에서 경험하세요.',
  keywords: [
    '사주', '사주팔자', '사주분석', '무료사주', 'AI사주',
    '타로', '타로카드', '무료타로', '타로리딩',
    '꿈해몽', '꿈풀이', '태몽', '길몽',
    '운세', '오늘의운세', '무료운세', '2026운세',
    '만세력', 'AI운세',
  ],
  authors: [{ name: '운세 에이전트' }],
  creator: '운세 에이전트',

  // 구글 검색 크롤링 허용
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // 정규 URL
  alternates: {
    canonical: BASE_URL,
  },

  // Open Graph (카카오톡·페이스북·슬랙 공유 미리보기)
  openGraph: {
    title: '운세 에이전트 — AI 사주·타로·꿈해몽',
    description: '만세력 사주팔자, 타로 카드, 꿈해몽을 AI가 분석합니다. 당신의 운명을 지금 확인하세요.',
    url: BASE_URL,
    siteName: '운세 에이전트',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '운세 에이전트 — AI 사주·타로·꿈해몽',
      },
    ],
  },

  // 트위터(X) 카드
  twitter: {
    card: 'summary_large_image',
    title: '운세 에이전트 — AI 사주·타로·꿈해몽',
    description: '만세력 사주팔자, 타로, 꿈해몽을 AI가 분석합니다.',
    images: ['/opengraph-image'],
  },

  // 검색엔진 인증 (발급 후 값 교체)
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_CODE',  // Google Search Console 인증 코드
    other: {
      'naver-site-verification': 'NAVER_WEBMASTER_CODE',  // 네이버 서치어드바이저 인증 코드
    },
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
