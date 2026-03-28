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
    <div className="border border-green-400/25 bg-green-400/5 p-3 md:p-4 text-center flex-1">
      <div className="text-green-400/50 text-[10px] font-pixel mb-3">{label}</div>
      <div className="space-y-0.5">
        <div className="text-2xl md:text-3xl text-white font-bold">{pillar.stemKor}</div>
        <div className="text-gray-600 text-xs">{pillar.stemHanja}</div>
      </div>
      <div className="w-full h-px bg-green-400/20 my-3" />
      <div className="space-y-0.5">
        <div className="text-2xl md:text-3xl text-green-400 font-bold">{pillar.branchKor}</div>
        <div className="text-gray-600 text-xs">{pillar.branchHanja}</div>
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
  // \r\n 정규화
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-green-400 font-pixel text-sm md:text-base mt-8 mb-3 pb-2 border-b border-green-400/20 glow-green-sm first:mt-0">
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed === '') {
      nodes.push(<div key={i} className="h-1.5" />);
    } else {
      // 인라인 **bold** 처리
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      nodes.push(
        <p key={i} className="text-gray-300 text-sm leading-[1.85] my-0.5">
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**')
              ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
              : part
          )}
        </p>
      );
    }
  });

  return nodes;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const name    = searchParams.get('name') || '';
  const gender  = searchParams.get('gender') || 'male';
  const year    = searchParams.get('year') || '';
  const month   = searchParams.get('month') || '';
  const day     = searchParams.get('day') || '';
  const hour    = searchParams.get('hour') || '12';
  const unknownTime = searchParams.get('unknownTime') === '1';
  const mode    = searchParams.get('mode') || 'standard';

  // 사주 계산은 클라이언트에서 직접 수행 (API 의존 없음)
  const saju = useMemo<SajuResult | null>(() => {
    if (!year || !month || !day) return null;
    try {
      return calculateSaju(+year, +month, +day, unknownTime ? 12 : +hour, unknownTime);
    } catch {
      return null;
    }
  }, [year, month, day, hour, unknownTime]);

  const [streamText, setStreamText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
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

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done: rdone, value } = await reader.read();
          if (rdone) break;
          const chunk = decoder.decode(value, { stream: true });
          setStreamText(prev => prev + chunk);
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
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm font-pixel">입력 정보가 올바르지 않습니다.</p>
        <Link href="/input" className="text-green-400 text-xs font-pixel hover:underline">← 다시 입력</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm font-pixel">{error}</p>
        <Link href={`/input?mode=${mode}`} className="text-green-400 text-xs font-pixel hover:underline">← 다시 시도</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="flex justify-between items-center px-6 py-5 border-b border-green-400/10">
        <Link href="/" className="font-pixel text-green-400 text-sm glow-green-sm hover:text-green-300 transition-colors">
          ← AI사주
        </Link>
        <div className="text-xs text-gray-600 font-pixel">
          {name}님의 {mode === 'daily' ? '오늘의 운세' : '사주 분석'}
        </div>
        <Link href={`/input?mode=${mode}`} className="text-xs text-gray-500 hover:text-green-400 transition-colors font-pixel">
          다시 분석
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* 사주팔자 */}
        <div className="mb-8">
          <div className="text-green-400/40 text-xs font-pixel tracking-widest mb-4">// 사주팔자</div>
          <div className="flex gap-2 mb-4">
            <PillarCard pillar={saju.year}  label="년주 年柱" />
            <PillarCard pillar={saju.month} label="월주 月柱" />
            <PillarCard pillar={saju.day}   label="일주 日柱" />
            <PillarCard pillar={saju.hour}  label="시주 時柱" />
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <span className="text-xs px-3 py-1.5 border border-green-400/20 bg-green-400/5 text-green-400 font-pixel">
              {saju.animal}띠
            </span>
            <span className="text-xs px-3 py-1.5 border border-green-400/20 bg-green-400/5 text-green-400/80">
              일간 {saju.dayMaster}
            </span>
            {saju.unknownTime && (
              <span className="text-xs px-3 py-1.5 border border-yellow-400/20 bg-yellow-400/5 text-yellow-400/70">
                시간 미상
              </span>
            )}
          </div>

          {/* 오행 분포 */}
          <div className="border border-green-400/15 bg-green-400/5 p-4">
            <div className="text-green-400/40 text-[10px] font-pixel mb-3">오행 분포</div>
            <div className="flex gap-4">
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
          <div className="text-green-400/40 text-xs font-pixel tracking-widest mb-5">// AI 분석</div>

          {!streamText && streaming && (
            <div className="flex items-center gap-3 text-gray-500 text-sm py-6">
              <div className="w-4 h-4 border border-green-400/30 border-t-green-400 rounded-full animate-spin shrink-0" />
              <span className="font-pixel text-green-400/60 animate-pulse text-xs">AI가 사주를 분석하는 중...</span>
            </div>
          )}

          {streamText && (
            <div className="leading-relaxed">
              {renderMarkdown(streamText)}
              {!done && (
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1 align-middle" />
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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
