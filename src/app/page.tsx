'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  loadStamps, getStreak, getMonthStamps, loadAchievements,
  ACHIEVEMENTS, type ServiceKey,
} from '@/lib/gamification';
import BakJinin from '@/components/characters/BakJinin';
import MadameCeleste from '@/components/characters/MadameCeleste';
import MongshinAra from '@/components/characters/MongshinAra';

const SERVICE_ICON: Record<ServiceKey, string> = { saju:'仙', tarot:'✦', dream:'☽' };
const SERVICE_COLOR: Record<ServiceKey, string> = {
  saju:'#7C3AED', tarot:'#FFB95F', dream:'#60A5FA',
};

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
    avatarRing: 'avatar-ring-violet',
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
    avatarRing: 'avatar-ring-gold',
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
    avatarRing: 'avatar-ring-blue',
  },
];

const STARS = [
  { x:5,y:8,s:1.5,d:2.1,del:0 },{ x:12,y:22,s:1,d:3.4,del:0.5 },{ x:20,y:5,s:2,d:2.8,del:1 },
  { x:28,y:45,s:1.5,d:3.1,del:0.8 },{ x:35,y:15,s:1,d:4.0,del:1.5 },{ x:42,y:60,s:2,d:2.5,del:0.3 },
  { x:50,y:30,s:1.5,d:3.7,del:2 },{ x:58,y:80,s:1,d:2.9,del:0.7 },{ x:65,y:12,s:2,d:3.2,del:1.2 },
  { x:72,y:50,s:1.5,d:4.1,del:0.4 },{ x:80,y:35,s:1,d:2.6,del:1.8 },{ x:88,y:70,s:2,d:3.5,del:0.6 },
  { x:93,y:20,s:1.5,d:2.3,del:2.2 },{ x:7,y:75,s:1,d:4.3,del:1.1 },{ x:17,y:90,s:2,d:2.7,del:0.9 },
  { x:30,y:65,s:1.5,d:3.8,del:1.4 },{ x:45,y:88,s:1,d:3.0,del:0.2 },{ x:60,y:42,s:2,d:2.4,del:1.7 },
  { x:75,y:92,s:1.5,d:3.6,del:0.1 },{ x:85,y:55,s:1,d:4.2,del:1.3 },
];

export default function HomePage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // 게임화 데이터 (클라이언트 전용)
  const [streak, setStreak] = useState(0);
  const [todayStamps, setTodayStamps] = useState<ServiceKey[]>([]);
  const [monthStamps, setMonthStamps] = useState<Record<number, ServiceKey[]>>({});
  const [unlockedAch, setUnlockedAch] = useState<string[]>([]);

  useEffect(() => {
    const now = new Date();
    setStreak(getStreak());
    setTodayStamps((loadStamps()[now.toISOString().slice(0,10)] ?? []) as ServiceKey[]);
    setMonthStamps(getMonthStamps(now.getFullYear(), now.getMonth() + 1));
    setUnlockedAch(loadAchievements());
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = now.getDate();
  const DOW_LABELS = ['일','월','화','수','목','금','토'];

  return (
    <main className="min-h-screen bg-[#0B1326] overflow-x-hidden">

      {/* 별 배경 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {STARS.map((st, i) => (
          <div key={i} className="star" style={{
            left:`${st.x}%`, top:`${st.y}%`,
            width:`${st.s}px`, height:`${st.s}px`,
            '--dur':`${st.d}s`, '--del':`${st.del}s`,
          } as React.CSSProperties} />
        ))}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-700"
          style={{ background: hoveredId==='saju' ? 'rgba(124,58,237,0.12)' : hoveredId==='tarot' ? 'rgba(255,185,95,0.10)' : hoveredId==='dream' ? 'rgba(96,165,250,0.10)' : 'rgba(124,58,237,0.06)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl transition-all duration-700"
          style={{ background: hoveredId==='dream' ? 'rgba(96,165,250,0.10)' : hoveredId==='tarot' ? 'rgba(255,185,95,0.08)' : 'rgba(96,165,250,0.06)' }} />
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
              <Link key={s.id} href={s.href} className={`text-xs transition-colors ${s.accentClass} opacity-70 hover:opacity-100`}>{s.title}</Link>
            ))}
          </nav>
        </header>

        {/* 히어로 */}
        <section className="text-center px-6 pt-16 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-violet-500/30 rounded-full text-violet-400/80 text-xs mb-8 bg-violet-600/10 font-pixel">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
            AI 기반 통합 운세 서비스
          </div>
          <h1 className="font-serif-kr text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            당신의 운명을<br />
            <span className="glow-gold" style={{ color:'#FFB95F' }}>AI가 읽습니다</span>
          </h1>
          <p className="text-[#E8E4F0]/50 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            사주팔자의 지혜, 타로 카드의 상징, 꿈의 메시지—<br />
            세 가지 통로를 통해 삶의 방향을 제시합니다
          </p>
        </section>

        {/* 서비스 카드 */}
        <section className="px-4 md:px-10 pb-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {SERVICES.map(svc => (
              <div key={svc.id}
                className={`relative border ${svc.borderClass} ${svc.bgClass} backdrop-blur-sm p-6 flex flex-col transition-all duration-300 cursor-pointer`}
                style={{
                  borderColor: hoveredId===svc.id ? svc.accentColor+'60' : undefined,
                  boxShadow: hoveredId===svc.id ? `0 0 30px ${svc.accentColor}18` : undefined,
                }}
                onMouseEnter={() => setHoveredId(svc.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 상단 레이블 + 심볼 */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-pixel ${svc.accentClass} opacity-50`}>{svc.subtitle}</span>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-lg font-serif-kr font-bold transition-all duration-300 ${svc.avatarRing}`}
                    style={{ borderColor:svc.accentColor+'50', background:svc.accentColor+'15', color:svc.accentColor }}>
                    {svc.symbol}
                  </div>
                </div>

                {/* 캐릭터 포트레이트 */}
                <div className="flex justify-center mb-3">
                  <div className="relative overflow-hidden" style={{ width: '120px', height: '180px' }}>
                    {svc.id === 'saju' && <BakJinin variant="card" />}
                    {svc.id === 'tarot' && <MadameCeleste variant="card" />}
                    {svc.id === 'dream' && <MongshinAra variant="card" />}
                    {/* 하단 페이드 */}
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0B1326] to-transparent" />
                  </div>
                </div>

                <div className={`text-xs font-pixel ${svc.accentClass} opacity-60 mb-1`}>{svc.character}</div>

                {/* 캐릭터 대사 hover */}
                <div className={`overflow-hidden transition-all duration-300 ${hoveredId===svc.id ? 'max-h-24 mb-3' : 'max-h-0 mb-0'}`}>
                  <p className={`text-sm leading-relaxed italic ${svc.accentClass} opacity-80 border-l-2 pl-2`}
                    style={{ borderColor:svc.accentColor+'50' }}>
                    "{svc.quote}"
                  </p>
                </div>

                <h2 className={`font-serif-kr text-3xl font-bold mb-1 ${svc.accentClass}`}>{svc.title}</h2>
                <p className="text-[#E8E4F0]/70 text-base mb-4">{svc.desc}</p>
                <p className="text-[#E8E4F0]/40 text-sm leading-relaxed mb-6 flex-1">{svc.detail}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {svc.tags.map(tag => <span key={tag} className={`text-xs px-2 py-0.5 border ${svc.badgeClass}`}>{tag}</span>)}
                </div>
                <Link href={svc.href} className={`block w-full text-center py-3 text-base font-medium transition-colors ${svc.btnClass}`}>
                  {svc.id==='saju' ? '사주 분석 시작' : svc.id==='tarot' ? '타로 카드 보기' : '꿈 해석하기'}
                </Link>
                {svc.id==='saju' && (
                  <Link href="/input?mode=daily" className={`block w-full text-center py-2.5 text-sm border transition-colors mt-2 ${svc.btnOutlineClass}`}>
                    오늘의 운세
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 내 운세 기록 ─────────────────────────────── */}
        <section className="px-4 md:px-10 pb-12">
          <div className="max-w-5xl mx-auto border border-violet-500/15 bg-violet-600/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-pixel text-violet-400/50 tracking-wider">// 내 운세 기록</span>
                {/* 스트릭 배지 */}
                {streak > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 border border-amber-500/30 bg-amber-500/10">
                    <span className="text-amber-400 text-sm">🔥</span>
                    <span className="text-amber-300 text-sm font-pixel">{streak}일 연속</span>
                  </div>
                )}
                {streak === 0 && (
                  <span className="text-xs font-pixel text-[#E8E4F0]/25">오늘부터 시작해보세요</span>
                )}
              </div>
              <button onClick={() => setShowCalendar(v => !v)}
                className="text-[10px] font-pixel text-violet-400/40 hover:text-violet-400/70 transition-colors">
                {showCalendar ? '접기 ▲' : '캘린더 ▼'}
              </button>
            </div>

            {/* 오늘의 도장 */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-pixel text-[#E8E4F0]/30">오늘</span>
              <div className="flex gap-2">
                {(['saju','tarot','dream'] as ServiceKey[]).map(svc => {
                  const stamped = todayStamps.includes(svc);
                  return (
                    <div key={svc}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-sm transition-all duration-300"
                      style={{
                        borderColor: stamped ? SERVICE_COLOR[svc]+'80' : 'rgba(255,255,255,0.1)',
                        background: stamped ? SERVICE_COLOR[svc]+'20' : 'transparent',
                        color: stamped ? SERVICE_COLOR[svc] : 'rgba(255,255,255,0.15)',
                        boxShadow: stamped ? `0 0 8px ${SERVICE_COLOR[svc]}40` : 'none',
                        fontFamily: svc === 'saju' ? 'serif' : 'inherit',
                      }}
                      title={svc}
                    >
                      {SERVICE_ICON[svc]}
                    </div>
                  );
                })}
              </div>
              {todayStamps.length === 0 && (
                <span className="text-xs font-pixel text-[#E8E4F0]/20 italic">아직 오늘의 운세를 보지 않았어요</span>
              )}
              {todayStamps.length > 0 && todayStamps.length < 3 && (
                <span className="text-xs font-pixel text-[#E8E4F0]/30 italic">
                  오늘 {todayStamps.length}가지 운세를 봤어요
                  {todayStamps.length < 3 && ' · 나머지도 해보세요!'}
                </span>
              )}
              {todayStamps.length === 3 && (
                <span className="text-amber-400/70 text-xs font-pixel">✦ 오늘 삼합 달성!</span>
              )}
            </div>

            {/* 스트릭 문구 */}
            {streak > 0 && (
              <p className="text-xs font-pixel text-[#E8E4F0]/25 mb-4">
                {streak >= 7 ? '🌟 ' : ''}{streak}일 연속 방문 중이에요. 어제 빠졌어도 오늘부터 다시 시작할 수 있어요.
              </p>
            )}

            {/* 캘린더 */}
            {showCalendar && (
              <div className="fade-up border-t border-violet-500/10 pt-4 mt-2">
                <div className="text-xs font-pixel text-[#E8E4F0]/30 mb-3 text-center">
                  {year}년 {month}월
                </div>
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DOW_LABELS.map(d => (
                    <div key={d} className="text-center text-[11px] font-pixel text-[#E8E4F0]/20">{d}</div>
                  ))}
                </div>
                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 gap-1">
                  {/* 빈 칸 (월 첫째 날 요일 오프셋) */}
                  {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const stamps = monthStamps[d] ?? [];
                    const isToday = d === today;
                    const hasStamp = stamps.length > 0;
                    return (
                      <div key={d}
                        className="aspect-square flex flex-col items-center justify-center relative"
                        style={{
                          border: isToday ? '1px solid rgba(124,58,237,0.5)' : hasStamp ? '1px solid rgba(255,255,255,0.06)' : undefined,
                          background: isToday ? 'rgba(124,58,237,0.15)' : hasStamp ? 'rgba(255,255,255,0.03)' : undefined,
                          borderRadius: '2px',
                        }}
                      >
                        <span className={`text-[11px] font-pixel leading-none ${isToday ? 'text-violet-300' : hasStamp ? 'text-[#E8E4F0]/50' : 'text-[#E8E4F0]/20'}`}>
                          {d}
                        </span>
                        {hasStamp && (
                          <div className="flex gap-0.5 mt-0.5">
                            {stamps.slice(0,3).map(svc => (
                              <div key={svc} className="w-1.5 h-1.5 rounded-full"
                                style={{ background: SERVICE_COLOR[svc] + 'CC' }} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 justify-center mt-3">
                  {(['saju','tarot','dream'] as ServiceKey[]).map(svc => (
                    <div key={svc} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: SERVICE_COLOR[svc] }} />
                      <span className="text-[11px] font-pixel text-[#E8E4F0]/30">
                        {svc==='saju'?'사주':svc==='tarot'?'타로':'꿈해몽'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 업적 */}
            {unlockedAch.length > 0 && (
              <div className="border-t border-violet-500/10 pt-4 mt-4">
                <div className="text-xs font-pixel text-violet-400/40 mb-3">업적</div>
                <div className="flex flex-wrap gap-2">
                  {unlockedAch.map(id => {
                    const ach = ACHIEVEMENTS[id];
                    if (!ach) return null;
                    return (
                      <div key={id} className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-sm ${ach.colorClass}`}
                        title={ach.desc}>
                        <span>{ach.icon}</span>
                        <span className="font-pixel text-xs">{ach.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="border-t border-violet-500/10 px-6 py-6 text-center">
          <p className="text-[#E8E4F0]/25 text-xs font-pixel">
            운세 에이전트 · AI 기반 사주·타로·꿈해몽 통합 서비스 · 오락 목적으로 제작되었습니다
          </p>
        </footer>
      </div>
    </main>
  );
}
