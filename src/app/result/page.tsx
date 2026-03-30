'use client';

import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { calculateSaju, SajuResult } from '@/lib/saju';

const ELEMENT_COLORS: Record<string, string> = {
  목: 'text-green-400',
  화: 'text-red-400',
  토: 'text-yellow-400',
  금: 'text-gray-300',
  수: 'text-blue-400',
};

const ELEMENT_BG: Record<string, string> = {
  목: 'bg-green-400/10 border-green-400/30',
  화: 'bg-red-400/10 border-red-400/30',
  토: 'bg-yellow-400/10 border-yellow-400/30',
  금: 'bg-gray-400/10 border-gray-400/30',
  수: 'bg-blue-400/10 border-blue-400/30',
};

function PillarCard({ pillar, label }: { pillar: SajuResult['year']; label: string }) {
  return (
    <div className="border border-violet-500/25 bg-violet-600/8 p-3 md:p-4 text-center flex-1">
      <div className="text-violet-400/50 text-[10px] font-pixel mb-3">{label}</div>
      <div className="space-y-0.5">
        <div className="text-2xl md:text-3xl text-white font-bold font-serif-kr">{pillar.stemKor}</div>
        <div className="text-[#E8E4F0]/30 text-xs">{pillar.stemHanja}</div>
      </div>
      <div className="w-full h-px bg-violet-500/20 my-3" />
      <div className="space-y-0.5">
        <div className="text-2xl md:text-3xl text-violet-300 font-bold font-serif-kr">{pillar.branchKor}</div>
        <div className="text-[#E8E4F0]/30 text-xs">{pillar.branchHanja}</div>
      </div>
      <div className="mt-3 flex gap-1 justify-center flex-wrap">
        <span className={`text-[10px] px-1.5 py-0.5 border ${ELEMENT_BG[pillar.stemElement]} ${ELEMENT_COLORS[pillar.stemElement]}`}>
          {pillar.stemElement}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 border ${ELEMENT_BG[pillar.branchElement]} ${ELEMENT_COLORS[pillar.branchElement]}`}>
          {pillar.branchElement}
        </span>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  return lines.map((line, i) => {
    const t = line.trim();
    if (t.startsWith('## '))
      return <h2 key={i} className="text-violet-400 font-serif-kr text-base font-semibold mt-8 mb-3 pb-2 border-b border-violet-500/20 first:mt-0">{t.slice(3)}</h2>;
    if (t === '')
      return <div key={i} className="h-1.5" />;
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-[#E8E4F0]/75 text-sm leading-[1.85] my-0.5">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="text-[#E8E4F0] font-medium">{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    );
  });
}

function ResultContent() {
  const searchParams = useSearchParams();
  const name        = searchParams.get('name') || '';
  const gender      = searchParams.get('gender') || 'male';
  const year        = searchParams.get('year') || '';
  const month       = searchParams.get('month') || '';
  const day         = searchParams.get('day') || '';
  const hour        = searchParams.get('hour') || '12';
  const unknownTime = searchParams.get('unknownTime') === '1';
  const mode        = searchParams.get('mode') || 'standard';

  const saju = useMemo<SajuResult | null>(() => {
    if (!year || !month || !day) return null;
    try {
      return calculateSaju(+year, +month, +day, unknownTime ? 12 : +hour, unknownTime);
    } catch { return null; }
  }, [year, month, day, hour, unknownTime]);

  const [streamText, setStreamText] = useState('');
  const [streaming,  setStreaming]  = useState(false);
  const [done,       setDone]       = useState(false);
  const [error,      setError]      = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current || !saju) return;
    calledRef.current = true;
    setStreaming(true);

    (async () => {
      try {
        const res = await fetch('/api/saju', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, gender, year, month, day, hour, unknownTime, mode }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: '오류가 발생했습니다.' }));
          setError(err.error);
          return;
        }
        const reader  = res.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done: rd, value } = await reader.read();
          if (rd) break;
          setStreamText(prev => prev + decoder.decode(value, { stream: true }));
        }
        setDone(true);
      } catch {
        setError('네트워크 오류가 발생했습니다.');
      } finally {
        setStreaming(false);
      }
    })();
  }, [saju]);

  if (!saju) {
    return (
      <div className="min-h-screen bg-[#0B1326] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm font-pixel">입력 정보가 올바르지 않습니다.</p>
        <Link href="/input" className="text-violet-400 text-xs font-pixel hover:underline">← 다시 입력</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1326] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm font-pixel">{error}</p>
        <Link href={`/input?mode=${mode}`} className="text-violet-400 text-xs font-pixel hover:underline">← 다시 시도</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1326]">
      <header className="flex justify-between items-center px-6 py-5 border-b border-violet-500/15">
        <Link href="/" className="font-serif-kr text-[#E8E4F0]/70 text-sm hover:text-[#E8E4F0] transition-colors">
          ← 운세 에이전트
        </Link>
        <div className="text-xs text-[#E8E4F0]/40 font-pixel">
          {name}님의 {mode === 'daily' ? '오늘의 운세' : '사주 분석'}
        </div>
        <Link href={`/input?mode=${mode}`} className="text-xs text-[#E8E4F0]/35 hover:text-violet-400 transition-colors font-pixel">
          다시 분석
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* 사주팔자 */}
        <div className="mb-8">
          <div className="text-violet-400/40 text-[10px] font-pixel tracking-[0.3em] mb-4">// 사주팔자</div>
          <div className="flex gap-2 mb-4">
            <PillarCard pillar={saju.year}  label="년주 年柱" />
            <PillarCard pillar={saju.month} label="월주 月柱" />
            <PillarCard pillar={saju.day}   label="일주 日柱" />
            <PillarCard pillar={saju.hour}  label="시주 時柱" />
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <span className="text-xs px-3 py-1.5 border border-violet-500/25 bg-violet-600/10 text-violet-300">
              {saju.animal}띠
            </span>
            <span className="text-xs px-3 py-1.5 border border-violet-500/25 bg-violet-600/10 text-[#E8E4F0]/60">
              일간 {saju.dayMaster}
            </span>
            {saju.unknownTime && (
              <span className="text-xs px-3 py-1.5 border border-amber-500/25 bg-amber-500/10 text-amber-400/70">
                시간 미상
              </span>
            )}
          </div>

          {/* 오행 분포 */}
          <div className="border border-violet-500/15 bg-violet-600/8 p-4">
            <div className="text-violet-400/40 text-[10px] font-pixel mb-3">오행 분포</div>
            <div className="flex gap-5">
              {Object.entries(saju.elements).map(([el, count]) => (
                <div key={el} className="flex flex-col items-center gap-1">
                  <span className={`text-xl font-bold ${ELEMENT_COLORS[el]}`}>{count}</span>
                  <span className={`text-xs ${ELEMENT_COLORS[el]}`}>{el}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI 분석 */}
        <div>
          <div className="text-violet-400/40 text-[10px] font-pixel tracking-[0.3em] mb-5">// AI 분석</div>

          {!streamText && streaming && (
            <div className="flex items-center gap-3 text-[#E8E4F0]/40 text-sm py-6">
              <div className="w-4 h-4 border border-violet-400/30 border-t-violet-400 rounded-full animate-spin shrink-0" />
              <span className="font-pixel text-violet-400/50 animate-pulse text-xs">AI가 사주를 분석하는 중...</span>
            </div>
          )}

          {streamText && (
            <div className="leading-relaxed">
              {renderMarkdown(streamText)}
              {!done && (
                <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-1 align-middle" />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B1326] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
