'use client';

import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { calculateSaju, SajuResult } from '@/lib/saju';
import AchievementToast from '@/components/AchievementToast';
import { markStamp, unlockAchievements, type Achievement } from '@/lib/gamification';

const ELEMENT_COLORS: Record<string, string> = {
  목:'text-green-400', 화:'text-red-400', 토:'text-yellow-400', 금:'text-gray-300', 수:'text-blue-400',
};
const ELEMENT_HEX: Record<string, string> = {
  목:'#4ade80', 화:'#f87171', 토:'#facc15', 금:'#d1d5db', 수:'#60a5fa',
};
const ELEMENT_BG: Record<string, string> = {
  목:'bg-green-400/10 border-green-400/30',
  화:'bg-red-400/10 border-red-400/30',
  토:'bg-yellow-400/10 border-yellow-400/30',
  금:'bg-gray-400/10 border-gray-400/30',
  수:'bg-blue-400/10 border-blue-400/30',
};

// 오행 레이더 차트 — 진입 시 0→100% 애니메이션
function ElementRadarChart({ elements }: { elements: Record<string, number> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTs: number | null = null;
    const duration = 900;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const ORDER = ['목', '화', '토', '금', '수'];
  const values = ORDER.map(k => elements[k] ?? 0);
  const maxVal = 8;
  const CX = 100, CY = 105, R = 68, N = 5;

  const axisAngle = (i: number) => (i * 2 * Math.PI / N) - Math.PI / 2;
  const axisPoint = (i: number, radius: number) => ({
    x: CX + radius * Math.cos(axisAngle(i)),
    y: CY + radius * Math.sin(axisAngle(i)),
  });
  const toPoints = (pts: { x: number; y: number }[]) =>
    pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const dataPoints = values.map((v, i) => {
    const ratio = Math.max(0.08, (v / maxVal) * progress);
    return axisPoint(i, R * ratio);
  });

  return (
    <svg width="200" height="210" viewBox="0 0 200 210" className="overflow-visible">
      {[0.25, 0.5, 0.75, 1].map(ratio => {
        const pts = ORDER.map((_, i) => axisPoint(i, R * ratio));
        return <polygon key={ratio} points={toPoints(pts)} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth="1" />;
      })}
      {ORDER.map((_, i) => {
        const end = axisPoint(i, R);
        return <line key={i} x1={CX} y1={CY} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)} stroke="rgba(124,58,237,0.2)" strokeWidth="1" />;
      })}
      <polygon points={toPoints(dataPoints)} fill="rgba(124,58,237,0.25)" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill={ELEMENT_HEX[ORDER[i]]} stroke="#0B1326" strokeWidth="1.5" />
      ))}
      {ORDER.map((_, i) => {
        const lp = axisPoint(i, R + 20);
        return (
          <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fontWeight="700" fill={ELEMENT_HEX[ORDER[i]]}>
            {ORDER[i]}{values[i]}
          </text>
        );
      })}
    </svg>
  );
}

// 오행 바 (애니메이션)
function ElementBar({ element, count, maxCount, progress }: { element: string; count: number; maxCount: number; progress: number }) {
  const pct = maxCount === 0 ? 0 : (count / maxCount) * 100 * progress;
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ELEMENT_HEX[element] }} />
      <span className={`text-sm font-bold w-4 ${ELEMENT_COLORS[element]}`}>{element}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-none" style={{ width:`${pct}%`, background: ELEMENT_HEX[element] + 'CC' }} />
      </div>
      <span className={`text-xs w-3 text-right ${ELEMENT_COLORS[element]} opacity-60`}>{count}</span>
    </div>
  );
}

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
        <span className={`text-[10px] px-1.5 py-0.5 border ${ELEMENT_BG[pillar.stemElement]} ${ELEMENT_COLORS[pillar.stemElement]}`}>{pillar.stemElement}</span>
        <span className={`text-[10px] px-1.5 py-0.5 border ${ELEMENT_BG[pillar.branchElement]} ${ELEMENT_COLORS[pillar.branchElement]}`}>{pillar.branchElement}</span>
      </div>
    </div>
  );
}

function renderMarkdown(text: string) {
  return text.replace(/\r\n/g, '\n').split('\n').map((line, i) => {
    const t = line.trim();
    if (t.startsWith('## '))
      return <h2 key={i} className="text-violet-400 font-serif-kr text-base font-semibold mt-8 mb-3 pb-2 border-b border-violet-500/20 first:mt-0">{t.slice(3)}</h2>;
    if (t === '') return <div key={i} className="h-1.5" />;
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-[#E8E4F0]/75 text-sm leading-[1.85] my-0.5">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j} className="text-[#E8E4F0] font-medium">{p.slice(2,-2)}</strong>
            : p
        )}
      </p>
    );
  });
}

const BJAKJININ_MSGS = [
  '천지인(天地人)의 기운을 살피는 중이오…',
  '팔자의 결을 읽고 있사오니 잠시 기다리시게…',
  '하늘의 뜻을 헤아리는 중이옵니다…',
];

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
    try { return calculateSaju(+year, +month, +day, unknownTime ? 12 : +hour, unknownTime); }
    catch { return null; }
  }, [year, month, day, hour, unknownTime]);

  const [streamText, setStreamText]   = useState('');
  const [streaming,  setStreaming]    = useState(false);
  const [done,       setDone]         = useState(false);
  const [error,      setError]        = useState('');
  const [msgIdx,     setMsgIdx]       = useState(0);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const calledRef   = useRef(false);
  const msgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxElement = saju ? Math.max(...Object.values(saju.elements), 1) : 1;

  useEffect(() => {
    if (calledRef.current || !saju) return;
    calledRef.current = true;
    setStreaming(true);

    msgTimerRef.current = setInterval(() => setMsgIdx(prev => (prev + 1) % BJAKJININ_MSGS.length), 2000);

    // 업적 + 스탬프
    markStamp('saju');
    const newAch = unlockAchievements('first_saju');
    if (newAch.length > 0) setAchievementQueue(newAch);

    (async () => {
      try {
        const res = await fetch('/api/saju', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ name, gender, year, month, day, hour, unknownTime, mode }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error:'오류가 발생했습니다.' }));
          setError(err.error); return;
        }
        const reader = res.body!.getReader();
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
        if (msgTimerRef.current) clearInterval(msgTimerRef.current);
      }
    })();

    return () => { if (msgTimerRef.current) clearInterval(msgTimerRef.current); };
  }, [saju]);

  if (!saju) return (
    <div className="min-h-screen bg-[#0B1326] flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-sm font-pixel">입력 정보가 올바르지 않습니다.</p>
      <Link href="/input" className="text-violet-400 text-xs font-pixel hover:underline">← 다시 입력</Link>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B1326] flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-sm font-pixel">{error}</p>
      <Link href={`/input?mode=${mode}`} className="text-violet-400 text-xs font-pixel hover:underline">← 다시 시도</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1326]">
      <AchievementToast queue={achievementQueue} onDone={() => setAchievementQueue([])} />

      <header className="flex justify-between items-center px-6 py-5 border-b border-violet-500/15">
        <Link href="/" className="font-serif-kr text-[#E8E4F0]/70 text-sm hover:text-[#E8E4F0] transition-colors">← 운세 에이전트</Link>
        <div className="text-xs text-[#E8E4F0]/40 font-pixel">{name}님의 {mode==='daily'?'오늘의 운세':'사주 분석'}</div>
        <Link href={`/input?mode=${mode}`} className="text-xs text-[#E8E4F0]/35 hover:text-violet-400 transition-colors font-pixel">다시 분석</Link>
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
            <span className="text-xs px-3 py-1.5 border border-violet-500/25 bg-violet-600/10 text-violet-300">{saju.animal}띠</span>
            <span className="text-xs px-3 py-1.5 border border-violet-500/25 bg-violet-600/10 text-[#E8E4F0]/60">일간 {saju.dayMaster}</span>
            {saju.unknownTime && <span className="text-xs px-3 py-1.5 border border-amber-500/25 bg-amber-500/10 text-amber-400/70">시간 미상</span>}
          </div>

          {/* 오행 레이더 + 바 */}
          <div className="border border-violet-500/15 bg-violet-600/8 p-4">
            <div className="text-violet-400/40 text-[10px] font-pixel mb-4">오행 분포</div>
            <div className="flex items-center gap-6 flex-wrap">
              <ElementRadarChart elements={saju.elements} />
              <div className="flex flex-col gap-2.5 flex-1 min-w-[120px]">
                {Object.entries(saju.elements).map(([el, count]) => (
                  <ElementBar key={el} element={el} count={count} maxCount={maxElement} progress={1} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI 분석 — 박진인 */}
        <div>
          <div className="text-violet-400/40 text-[10px] font-pixel tracking-[0.3em] mb-5">// AI 분석 by 박진인</div>

          {!streamText && streaming && (
            <div className="flex flex-col items-center gap-5 py-12">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500/50 bg-violet-600/15 flex items-center justify-center text-3xl font-serif-kr font-bold text-violet-400 avatar-ring-violet"
                style={{ textShadow:'0 0 12px rgba(124,58,237,0.8)' }}>仙</div>
              <div className="text-center">
                <div className="text-violet-400/50 text-[11px] font-pixel mb-2">박진인 朴眞人</div>
                <p className="text-[#E8E4F0]/60 text-sm italic transition-opacity duration-500" key={msgIdx}>
                  "{BJAKJININ_MSGS[msgIdx]}"
                </p>
              </div>
              <div className="dot-bounce text-violet-400/40 text-lg"><span>·</span><span>·</span><span>·</span></div>
            </div>
          )}

          {streamText && (
            <div className="leading-relaxed">
              {renderMarkdown(streamText)}
              {!done && <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-1 align-middle" />}
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
