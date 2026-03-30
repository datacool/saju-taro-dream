'use client';

import { useState } from 'react';
import Link from 'next/link';

const SERVICES = [
  {
    id: 'saju',
    symbol: '仙',
    title: '사주',
    subtitle: 'FOUR PILLARS',
    desc: '만세력 기반 사주팔자 분석',
    detail: '절기 기반 정확한 만세력으로 타고난 기질부터 재물운, 연애운까지 AI가 심층 분석합니다',
    tags: ['기질분석', '직업운', '연애운', '재물운', '건강운', '올해운세'],
    href: '/input?mode=standard',
    character: '박진인',
    quote: '허허, 자네의 타고난 기운이 궁금하신가? 천지인의 이치로 운명을 살펴보겠소.',
    accentColor: '#7C3AED',
    accentClass: 'text-violet-400',
    borderClass: 'border-violet-500/30',
    bgClass: 'bg-violet-600/10',
    badgeClass: 'border-violet-500/30 bg-violet-600/10 text-violet-300',
    btnClass: 'bg-violet-600 hover:bg-violet-500 text-white',
    btnOutlineClass: 'border-violet-500/40 text-violet-400 hover:border-violet-400 hover:bg-violet-600/10',
    glowClass: 'glow-purple',
    avatarRing: 'avatar-ring-violet',
    nebulaClass: 'bg-violet-700/12',
  },
  {
    id: 'tarot',
    symbol: '✦',
    title: '타로',
    subtitle: 'TAROT READING',
    desc: '78장 타로 카드 AI 해석',
    detail: '당신의 고민에 맞는 3장의 카드가 펼쳐집니다. 상황·조언·결과를 AI가 깊이 있게 해석합니다',
    tags: ['상황분석', '조언카드', '결과예측', '3카드 스프레드'],
    href: '/tarot',
    character: '마담 셀레스트',
    quote: 'Les étoiles vous attendent… 별들이 당신을 기다리고 있어요. 카드가 속삭입니다.',
    accentColor: '#FFB95F',
    accentClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10',
    badgeClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    btnClass: 'bg-amber-500 hover:bg-amber-400 text-black',
    btnOutlineClass: 'border-amber-500/40 text-amber-400 hover:border-amber-400 hover:bg-amber-500/10',
    glowClass: 'glow-gold',
    avatarRing: 'avatar-ring-gold',
    nebulaClass: 'bg-amber-700/10',
  },
  {
    id: 'dream',
    symbol: '☽',
    title: '꿈해몽',
    subtitle: 'DREAM ORACLE',
    desc: '꿈의 상징과 메시지 해석',
    detail: '꿈 속 상징들이 전하는 메시지를 심리학적·운세적 관점에서 AI가 해석해 드립니다',
    tags: ['상징해석', '심리분석', '운세관점', '잠재의식'],
    href: '/dream',
    character: '몽신 아라',
    quote: '어젯밤 꿈이 아직 마음에 남아 있나요? 꿈의 결이 저에게도 느껴져요…',
    accentColor: '#60A5FA',
    accentClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    bgClass: 'bg-blue-500/10',
    badgeClass: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    btnClass: 'bg-blue-600 hover:bg-blue-500 text-white',
    btnOutlineClass: 'border-blue-500/40 text-blue-400 hover:border-blue-400 hover:bg-blue-500/10',
    glowClass: 'glow-blue',
    avatarRing: 'avatar-ring-blue',
    nebulaClass: 'bg-blue-700/10',
  },
];

const STARS = [
  { x:5,  y:8,  s:1.5, d:2.1, del:0   },
  { x:12, y:22, s:1,   d:3.4, del:0.5 },
  { x:20, y:5,  s:2,   d:2.8, del:1   },
  { x:28, y:45, s:1.5, d:3.1, del:0.8 },
  { x:35, y:15, s:1,   d:4.0, del:1.5 },
  { x:42, y:60, s:2,   d:2.5, del:0.3 },
  { x:50, y:30, s:1.5, d:3.7, del:2   },
  { x:58, y:80, s:1,   d:2.9, del:0.7 },
  { x:65, y:12, s:2,   d:3.2, del:1.2 },
  { x:72, y:50, s:1.5, d:4.1, del:0.4 },
  { x:80, y:35, s:1,   d:2.6, del:1.8 },
  { x:88, y:70, s:2,   d:3.5, del:0.6 },
  { x:93, y:20, s:1.5, d:2.3, del:2.2 },
  { x:7,  y:75, s:1,   d:4.3, del:1.1 },
  { x:17, y:90, s:2,   d:2.7, del:0.9 },
  { x:30, y:65, s:1.5, d:3.8, del:1.4 },
  { x:45, y:88, s:1,   d:3.0, del:0.2 },
  { x:60, y:42, s:2,   d:2.4, del:1.7 },
  { x:75, y:92, s:1.5, d:3.6, del:0.1 },
  { x:85, y:55, s:1,   d:4.2, del:1.3 },
];

export default function HomePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#0B1326] overflow-x-hidden">

      {/* 별 배경 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {STARS.map((st, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: `${st.s}px`,
              height: `${st.s}px`,
              '--dur': `${st.d}s`,
              '--del': `${st.del}s`,
            } as React.CSSProperties}
          />
        ))}
        {/* nebula gradients — 호버 서비스 색상으로 반응 */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-700"
          style={{
            background: hoveredId === 'saju' ? 'rgba(124,58,237,0.12)'
              : hoveredId === 'tarot' ? 'rgba(255,185,95,0.10)'
              : hoveredId === 'dream' ? 'rgba(96,165,250,0.10)'
              : 'rgba(124,58,237,0.06)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-700"
          style={{
            background: hoveredId === 'dream' ? 'rgba(96,165,250,0.10)'
              : hoveredId === 'tarot' ? 'rgba(255,185,95,0.08)'
              : 'rgba(96,165,250,0.06)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* 헤더 */}
        <header className="flex justify-between items-center px-6 md:px-10 py-6 border-b border-violet-500/10">
          <div className="flex items-center gap-3">
            <span className="font-serif-kr text-white text-lg font-semibold tracking-wide">운세 에이전트</span>
            <span className="hidden sm:block text-[10px] font-pixel text-violet-400/60 border border-violet-500/20 px-2 py-0.5">AI FORTUNE</span>
          </div>
          <nav className="flex items-center gap-5">
            {SERVICES.map(s => (
              <Link
                key={s.id}
                href={s.href}
                className={`text-xs transition-colors ${s.accentClass} opacity-70 hover:opacity-100`}
              >
                {s.title}
              </Link>
            ))}
          </nav>
        </header>

        {/* 히어로 */}
        <section className="text-center px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-violet-500/30 rounded-full text-violet-400/80 text-[11px] mb-8 bg-violet-600/10 font-pixel">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
            AI 기반 통합 운세 서비스
          </div>

          <h1 className="font-serif-kr text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            당신의 운명을<br />
            <span className="glow-gold" style={{ color:'#FFB95F' }}>AI가 읽습니다</span>
          </h1>

          <p className="text-[#E8E4F0]/50 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            사주팔자의 지혜, 타로 카드의 상징, 꿈의 메시지—<br />
            세 가지 통로를 통해 삶의 방향을 제시합니다
          </p>
        </section>

        {/* 서비스 카드 */}
        <section className="px-4 md:px-10 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {SERVICES.map(svc => (
              <div
                key={svc.id}
                className={`relative border ${svc.borderClass} ${svc.bgClass} backdrop-blur-sm p-6 flex flex-col group transition-all duration-300 cursor-pointer`}
                style={{
                  borderColor: hoveredId === svc.id ? svc.accentColor + '60' : undefined,
                  boxShadow: hoveredId === svc.id ? `0 0 30px ${svc.accentColor}18` : undefined,
                }}
                onMouseEnter={() => setHoveredId(svc.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 상단 라벨 */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-pixel ${svc.accentClass} opacity-50`}>{svc.subtitle}</span>
                  {/* 캐릭터 아바타 */}
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg font-serif-kr font-bold transition-all duration-300 ${svc.avatarRing}`}
                    style={{
                      borderColor: svc.accentColor + '50',
                      background: svc.accentColor + '15',
                      color: svc.accentColor,
                    }}
                  >
                    {svc.symbol}
                  </div>
                </div>

                {/* 캐릭터 이름 */}
                <div className={`text-[10px] font-pixel ${svc.accentClass} opacity-60 mb-1`}>
                  {svc.character}
                </div>

                {/* 캐릭터 대사 — 호버 시 등장 */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${hoveredId === svc.id ? 'max-h-20 mb-3' : 'max-h-0 mb-0'}`}
                >
                  <p
                    className={`text-[11px] leading-relaxed italic ${svc.accentClass} opacity-80 border-l-2 pl-2`}
                    style={{ borderColor: svc.accentColor + '50' }}
                  >
                    "{svc.quote}"
                  </p>
                </div>

                {/* 제목 */}
                <h2 className={`font-serif-kr text-3xl font-bold mb-1 ${svc.accentClass}`}>{svc.title}</h2>
                <p className="text-[#E8E4F0]/70 text-sm mb-4">{svc.desc}</p>
                <p className="text-[#E8E4F0]/40 text-xs leading-relaxed mb-6 flex-1">{svc.detail}</p>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {svc.tags.map(tag => (
                    <span key={tag} className={`text-[10px] px-2 py-0.5 border ${svc.badgeClass}`}>{tag}</span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={svc.href}
                  className={`block w-full text-center py-3 text-sm font-medium transition-colors ${svc.btnClass}`}
                >
                  {svc.id === 'saju' ? '사주 분석 시작' : svc.id === 'tarot' ? '타로 카드 보기' : '꿈 해석하기'}
                </Link>

                {svc.id === 'saju' && (
                  <Link
                    href="/input?mode=daily"
                    className={`block w-full text-center py-2.5 text-xs border transition-colors mt-2 ${svc.btnOutlineClass}`}
                  >
                    오늘의 운세
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="border-t border-violet-500/10 px-6 py-6 text-center">
          <p className="text-[#E8E4F0]/25 text-[11px] font-pixel">
            운세 에이전트 · AI 기반 사주·타로·꿈해몽 통합 서비스 · 오락 목적으로 제작되었습니다
          </p>
        </footer>
      </div>
    </main>
  );
}
